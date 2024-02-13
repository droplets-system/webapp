import i18n from 'sveltekit-i18n';
import { dev } from '$app/environment';
import lang from './lang.json';

export const defaultLocale = 'en';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
	log: {
		level: dev ? 'warn' : 'error'
	},
	translations: {
		en: { lang },
		zh: { lang }
	},
	loaders: [
		// English
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'en',
			key: 'inventory',
			routes: ['/drops', '/drops/list'],
			loader: async () => (await import('./en/inventory.json')).default
		},
		{
			locale: 'en',
			key: 'generate',
			routes: ['/generate'],
			loader: async () => (await import('./en/generate.json')).default
		},
		{
			locale: 'en',
			key: 'oracles',
			routes: ['/oracles'],
			loader: async () => (await import('./en/oracles.json')).default
		},
		// Chinese (Simplified)
		{
			locale: 'zh',
			key: 'common',
			loader: async () => (await import('./zh/common.json')).default
		},
		{
			locale: 'zh',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./zh/home.json')).default
		},
		{
			locale: 'zh',
			key: 'inventory',
			routes: ['/drops', '/drops/list'],
			loader: async () => (await import('./zh/inventory.json')).default
		},
		{
			locale: 'zh',
			key: 'generate',
			routes: ['/generate'],
			loader: async () => (await import('./zh/generate.json')).default
		},
		{
			locale: 'zh',
			key: 'oracles',
			routes: ['/oracles'],
			loader: async () => (await import('./zh/oracles.json')).default
		},
		// Korean
		{
			locale: 'ko',
			key: 'common',
			loader: async () => (await import('./ko/common.json')).default
		},
		{
			locale: 'ko',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./ko/home.json')).default
		},
		{
			locale: 'ko',
			key: 'inventory',
			routes: ['/drops', '/drops/list'],
			loader: async () => (await import('./ko/inventory.json')).default
		},
		{
			locale: 'ko',
			key: 'generate',
			routes: ['/generate'],
			loader: async () => (await import('./ko/generate.json')).default
		},
		{
			locale: 'ko',
			key: 'oracles',
			routes: ['/oracles'],
			loader: async () => (await import('./ko/oracles.json')).default
		}
	]
};

export const {
	t,
	loading,
	locales,
	locale,
	translations,
	loadTranslations,
	addTranslations,
	setLocale,
	setRoute
} = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));
