import { useEffect, useState } from 'react';
import { useUserContext } from '.';
import { EUserStatus } from 'src/context/interfaces';
import { SettingsService } from 'src/services/RecruiterSettingsService';
import { useCompany } from 'src/useCompany';

export interface IIntegrationOptions {
	unifiedApi: string;
	serviceId: string;
	name: string;
	import: boolean;
	export: boolean;
}

const INTEGRATION_OPTIONS_KEY = 'integrations_options';

const saveIntegrationsIntoSession = (options: IIntegrationOptions[]) => {
	sessionStorage.setItem(INTEGRATION_OPTIONS_KEY, JSON.stringify(options));
};

const getIntegrationOptionsFromSession = async () => {
	const data = await sessionStorage.getItem(INTEGRATION_OPTIONS_KEY);
	if (!data) return null;
	return JSON.parse(data);
};

export const useIntegrations = () => {
	const [integrationConnected, setIntegrationConnected] =
		useState<boolean>(false);
	const [integrationToken, setIntegrationToken] = useState<string | null>(null);
	const [integrationsOptions, setIntegrationsOptions] = useState<
		IIntegrationOptions[] | null
	>(null);
	const [selectedIntegration, selectedIntegrationOptions] =
		useState<IIntegrationOptions>();

	const { user } = useUserContext();

	const { company } = useCompany();

	const isUserAbleToImport =
		selectedIntegration.import && user?.status === EUserStatus.Online;

	const getIntegrationToken = async () => {
		const token = await SettingsService.getIntegrationToken();
		if (token) {
			setIntegrationToken(token);
		}
	};

	const getIntegrationsOptions = async () => {
		const sessionData = await getIntegrationOptionsFromSession();
		if (sessionData) {
			setIntegrationsOptions(sessionData);
			return;
		}
		const data = await SettingsService.getIntegrationsOptions();
		setIntegrationsOptions(data);
		saveIntegrationsIntoSession(data);
	};

	useEffect(() => {
		setIntegrationConnected(!!company?.integration);
		integrationsOptions?.forEach(({ serviceId, ...props }) => {
			if (serviceId === company?.integration?.serviceId) {
				selectedIntegrationOptions({ ...props, serviceId });
			}
		});
	}, [company?.integration]);

	useEffect(() => {
		getIntegrationsOptions();
	}, []);

	return {
		integrationConnected,
		integrationData: company?.integration,
		isUserAbleToImport,
		getIntegrationToken,
		integrationToken,
		selectedIntegration,
		exportAvailable: selectedIntegration?.export,
	};
};
