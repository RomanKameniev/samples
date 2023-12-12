import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface IUseFiltersUrl<T> {
	initialValues: T;
	skipFilterKeys: any;
	simpleFilterKeys: any;
	arrayFilterKeys: any;
	objectFilterKeys: any;
}

export const checkIfFilterDefault = (
	filterKey: string,
	filterValue: any,
	initialValues: any
) => {
	const defaultValue = initialValues[filterKey];
	return JSON.stringify(defaultValue) === JSON.stringify(filterValue);
};

export const useFiltersUrl = <T extends Record<string, any>>({
	initialValues,
	skipFilterKeys,
	simpleFilterKeys,
	arrayFilterKeys,
	objectFilterKeys,
}: IUseFiltersUrl<T>) => {
	const MSkippedFilters = useMemo(
		() => new Map(Object.keys(skipFilterKeys).map(key => [key, key])),
		[]
	);
	const MSimpleFilters = useMemo(
		() => new Map(Object.keys(simpleFilterKeys).map(key => [key, key])),
		[]
	);
	const MArrayFilters = useMemo(
		() => new Map(Object.keys(arrayFilterKeys).map(key => [key, key])),
		[]
	);
	const MObjectFilters = useMemo(
		() => new Map(Object.keys(objectFilterKeys).map(key => [key, key])),
		[]
	);

	const [_params, setParams]: [URLSearchParams, Function] = useSearchParams();

	const updateUrlWithFilters = (filters: T) => {
		const newFilters: Record<string, string> = {};
		Object.entries(filters).forEach(([key, value]) => {
			if (
				MSkippedFilters.has(key) ||
				checkIfFilterDefault(key, value, initialValues)
			) {
				return;
			}

			if (MSimpleFilters.has(key)) {
				newFilters[key] = value;
				return;
			}

			if (MArrayFilters.has(key)) {
				const arrayValue = value as Array<number>;
				newFilters[key] = arrayValue.map(val => val).join(',');
				return;
			}
			if (MObjectFilters.has(key)) {
				Object.entries(value as {}).forEach(([nestedKey, nestedValue]) => {
					newFilters[`${key}-${nestedKey}`] = nestedValue as string;
				});
			}
		});

		setParams(newFilters);
	};

	const parseValue = (val: 'false' | 'true' | any) => {
		if (!isNaN(Number(val))) {
			return Number(val);
		}
		if (val === 'false') {
			return false;
		}
		if (val === 'true') {
			return true;
		}
		return val;
	};

	const urlToFilters = (url: URLSearchParams) => {
		const filtersFromUrl = {
			...initialValues,
		} as T;
		for (const [urlKey, val] of url) {
			const [key, suffix] = urlKey.split('-') as [keyof T, string | undefined];
			if (val.indexOf(',') !== -1) {
				Object.assign(filtersFromUrl, {
					[key]: val.split(',').map(key => parseValue(key)),
				});
				continue;
			}

			if (!suffix?.length) {
				Object.assign(filtersFromUrl, { [key]: parseValue(val) });
				continue;
			}

			Object.assign(filtersFromUrl, {
				[key]: {
					...(filtersFromUrl[key] as Object),
					[suffix]: parseValue(val),
				},
			});
		}

		return filtersFromUrl;
	};

	return { updateUrlWithFilters, urlToFilters };
};
