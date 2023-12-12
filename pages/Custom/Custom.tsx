import { type FC, lazy } from 'react';
import { Keys } from '@common/enums/Keys';
import { CommonPageConfigurationsContext } from '@common/pages/Custom/services';
import { EDetailsTabs } from '@common/pages/Custom/types';

import { getInit, getCategories, getTerms } from './api';
import { keysOverride } from './Keys';

const InitPage = lazy(() => import('@common/pages/Init'));

export const Custom: FC = () => (
	<CommonPageConfigurationsContext.Provider
		value={{
			pageTitle: 'Tep custom',
			disableActionSelectorFilter: true,
			areReadonlyDetails: true,
			isActionItemHidden: true,
			availableDetailsTabs: [
				EDetailsTabs.init,
				EDetailsTabs.description,
				EDetailsTabs.purchase,
			],
			availableOptions: {
				transport: true,
				send: true,
				currency: false,
			},
			rqKeysOverrides: {
				[Keys.INIT]: {
					key: keysOverride.INIT,
					apiMethod: getInit,
				},
				[Keys.INIT_GET]: {
					key: keysOverride.INIT_GET,
					apiMethod: getCategories,
				},
				[Keys.TERMS]: {
					key: keysOverride.TERMS,
					apiMethod: getTerms,
				},
			},
		}}
	>
		<InitPage />
	</CommonPageConfigurationsContext.Provider>
);
