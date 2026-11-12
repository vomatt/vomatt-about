import { defineQuery } from 'groq';

import { DEFAULT_LOCALE, type Locale, LOCALES } from '@/i18n/locales';

/** The params every locale-aware query takes: the URL's locale and its URL prefix from the locale table. */
export const localeParams = (locale: Locale) => ({ locale, prefix: LOCALES[locale].prefix });

// Docs written before translations existed have no language; they are the default locale's
const docLanguage = `coalesce(language, "${DEFAULT_LOCALE}")`;
// With `[0]`, the doc in the request's $locale if there is one, else the default locale's
const inLocaleOrDefault = `${docLanguage} in [$locale, "${DEFAULT_LOCALE}"]`;
const preferLocale = `order(select(${docLanguage} == $locale => 0, 1))`;
// Every language the page is written in, for hreflang
const translations = (match: string) => `"translations": array::unique(*[${match}]{"l": ${docLanguage}}.l)`;

// Base queries for common fields
const baseFields = defineQuery(`
	_id,
	_type,
	title,
	"slug": slug.current,
	"sharing":{
		...sharing,
		"siteTitle": *[_type == "settingsGeneral"][0].siteTitle,
	}
`);
// An internal link stays in the request's locale ($prefix); a page without that translation falls back there
export const resolvedHrefQuery = defineQuery(`
	"resolvedHref": select(
			linkType == "external" => externalUrl,
			linkType == "internal" => internalLink-> {
				"url": select(
					_type == "pHome" => select($prefix == "" => "/", $prefix),
					defined(slug.current) => $prefix + "/" + slug.current,
					null
				)
			}.url,
			null)`);
const linkFields = defineQuery(`
	_type,
	"linkType": linkInput.linkType,
	"href": linkInput {
		${resolvedHrefQuery}
	}.resolvedHref,
	isNewTab
`);

export const imageMetaFields = defineQuery(`
	asset,
	crop,
	customRatio,
	hotspot,
	"alt": coalesce(alt, asset->altText)
`);

const callToActionFields = defineQuery(`
	label,
	link {
		${linkFields}
	}
`);

const portableTextContentFields = defineQuery(`
	...,
	markDefs[]{
		...,
		_type == "link" => {
			${linkFields}
		},
		_type == "callToAction" => {
			${callToActionFields}
		}
	},
	_type == "image" => {
		${imageMetaFields},
		link {
			${linkFields}
		}
	}
`);

const freeformFields = defineQuery(`
	_type,
	_key,
	content[]{
		${portableTextContentFields}
	},
	sectionAppearance {
		...,
		"backgroundColor": backgroundColor->color,
		"textColor": textColor->color
	}
`);

const sectionHeadingFields = defineQuery(`
	eyebrow,
	heading,
	intro
`);

const pageModuleFields = defineQuery(`
	_type in ['hero', 'callout'] => {
		_type,
		_key,
		${sectionHeadingFields},
		actions[]{
			_key,
			${callToActionFields}
		}
	},
	_type == 'editorial' => {
		_type,
		_key,
		${sectionHeadingFields},
		body[]{
			${portableTextContentFields}
		},
		media {
			${imageMetaFields}
		},
		mediaPosition
	},
	_type == 'featureList' => {
		_type,
		_key,
		${sectionHeadingFields},
		layout,
		items[]{
			_key,
			icon,
			title,
			body
		}
	},
	_type == 'accordionList' => {
		_type,
		_key,
		${sectionHeadingFields},
		items[]{
			_key,
			title,
			content[]{
				${portableTextContentFields}
			}
		}
	},
	_type == 'freeform' => {
		${freeformFields}
	},
	// Not rendered here; the key keeps the list stable
	_type in ['carousel', 'marquee'] => {
		_type,
		_key
	}
`);

export const siteSharingQuery = defineQuery(`
	*[_type == "settingsGeneral"][0]{
		siteTitle,
		shareGraphic,
		'shareVideo': shareVideo.asset->url,
		favicon,
		faviconLight,
		"integrations": *[_type == "settingsIntegration"][0]{
			gaIDs,
			gtmIDs
		}
	}
`);

export const pageGeneralQuery = defineQuery(`
	*[_type == "pGeneral" && slug.current == $slug && ${inLocaleOrDefault}] | ${preferLocale}[0]{
		${baseFields},
		"language": ${docLanguage},
		${translations('_type == "pGeneral" && slug.current == ^.slug.current')},
		_updatedAt,
		layout,
		showLastUpdated,
		showCookieSettings,
		content[]{
			${portableTextContentFields}
		},
		pageModules[]{
			${pageModuleFields}
		}
	}
`);
export const pageGeneralSlugsQuery = defineQuery(`
  *[_type == "pGeneral" && defined(slug.current)]
  {"slug": slug.current}
`);

// A homepage renders only with every section filled in; a translation missing one falls back to the default locale's
const homeComplete = `_type == "pHome" && defined(hero) && defined(howItWorks.steps) && defined(whySealed.openCount) && defined(whySealed.sealed) && defined(features.items) && defined(useCases.items) && defined(promise.rules) && defined(finalCta)`;

/** Every page on the site, once per language it's written in. */
export const sitemapQuery = defineQuery(`
	*[(${homeComplete}) || (_type == "pGeneral" && defined(slug.current))]{
		"path": select(_type == "pHome" => "/", "/" + slug.current),
		"language": ${docLanguage}
	}
`);

export const homeQuery = defineQuery(`
	*[${homeComplete} && ${inLocaleOrDefault}] | ${preferLocale}[0]{
		"language": ${docLanguage},
		${translations(homeComplete)},
		"sharing": {
			...sharing,
			"siteTitle": *[_type == "settingsGeneral"][0].siteTitle,
		},
		hero,
		howItWorks,
		whySealed,
		features,
		useCases,
		promise {
			...,
			footnote[]{
				${portableTextContentFields}
			}
		},
		finalCta
	}
`);
