import { useFiltersUrl } from './useFiltersUrl';

enum ESimpleFiltersKeys {
	englishProficiency = 'englishProficiency',
	search = 'search',
	country = 'country',
	city = 'city',
}

enum ESkippedFiltersKeys {
	page = 'page',
	location = 'location',
}

enum EArrayFiltersKeys {
	expectations = 'expectations',
}

enum EObjectFiltersKeys {
	experienceYears = 'experienceYears',
	employmentType = 'employmentType',
}

export const useFilterUserTypeB = (initialValues: IUserTypeB['filters']) => ({
	...useFiltersUrl<IUserTypeB['filters']>({
		initialValues,
		skipFilterKeys: ESkippedFiltersKeys,
		simpleFilterKeys: ESimpleFiltersKeys,
		arrayFilterKeys: EArrayFiltersKeys,
		objectFilterKeys: EObjectFiltersKeys,
	}),
});
