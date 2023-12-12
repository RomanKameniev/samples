import { useFiltersUrl } from '../../../../shared/hooks';

enum ESimpleFiltersKeys {
	interaction = 'interaction',
	remoteWork = 'remoteWork',
	englishProficiency = 'englishProficiency',
	search = 'search',
	country = 'country',
	city = 'city',
}

enum ESkippedFiltersKeys {
	page = 'page',
}

enum EArrayFiltersKeys {
	desiredMonthlySalary = 'desiredMonthlySalary',
	experienceYears = 'experienceYears',
}

enum EObjectFiltersKeys {
	jobSearchType = 'jobSearchType',
	employmentType = 'employmentType',
	location = 'location',
}

export const useFilterUserTypeC = (initialValues: IUserTypeC['filters']) => ({
	...useFiltersUrl<IUserTypeC['filters']>({
		initialValues,
		skipFilterKeys: ESkippedFiltersKeys,
		simpleFilterKeys: ESimpleFiltersKeys,
		arrayFilterKeys: EArrayFiltersKeys,
		objectFilterKeys: EObjectFiltersKeys,
	}),
});
