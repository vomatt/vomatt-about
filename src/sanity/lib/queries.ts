import { defineQuery } from 'groq';

import { DEFAULT_LOCALE } from '@/i18n/locales';

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
// An internal link stays in the request's $locale; a page without that translation falls back there
const localePrefix = `select($locale == "${DEFAULT_LOCALE}" => "", "/" + $locale)`;
export const resolvedHrefQuery = defineQuery(`
	"resolvedHref": select(
			linkType == "external" => externalUrl,
			linkType == "internal" => internalLink-> {
				"url": select(
					_type == "pHome" => select($locale == "${DEFAULT_LOCALE}" => "/", "/" + $locale),
					defined(slug.current) => ${localePrefix} + "/" + slug.current,
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
	"meta": asset-> {
		"id": assetId,
		"alt": coalesce(^.alt, altText),
		"type": mimeType,
		"width": metadata.dimensions.width,
		"height": metadata.dimensions.height,
		"aspectRatio": metadata.dimensions.aspectRatio,
		"lqip": metadata.lqip
	}
`);

const callToActionFields = defineQuery(`
	label,
	link {
		${linkFields}
	},
	"isButton": true
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
	_type == 'carousel' => {
		_type,
		_key,
		items[0...10], // Limit items for performance
		autoplay,
		autoplayInterval
	},
	_type == 'marquee' => {
		_type,
		_key,
		items[]{
			_type == 'simple' => {
				_type,
				text
			},
			_type == 'image' => {
				_type,
				"image": {
					${imageMetaFields}
				}
			}
		}[0...20], // Limit items for performance
		speed,
		reverse,
		pausable,
		showGradient,
		"gradientColor": gradientColor->color.hex,
		isMerged
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

/** Every page on the site, once per language it's written in. */
export const sitemapQuery = defineQuery(`
	*[_type == "pHome" || (_type == "pGeneral" && defined(slug.current))]{
		"path": select(_type == "pHome" => "/", "/" + slug.current),
		"language": ${docLanguage}
	}
`);


export const homeQuery = defineQuery(`
	*[_type == "pHome" && ${inLocaleOrDefault}] | ${preferLocale}[0]{
		"language": ${docLanguage},
		${translations('_type == "pHome"')},
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
