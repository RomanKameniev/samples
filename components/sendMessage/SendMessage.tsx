import { useState } from 'react';
import { SendMessageModal } from '../SendMessageModal';
import { Footer } from 'src/components/Footer';
import styles from './SendMessageWithFooter.module.scss';
import { useUserContext } from 'src/hooks';
import { EUserRole } from 'src/context/interfaces';
import logger from 'src/utils/logger';
import EErrorType from 'src/enums/ErrorType';
import IUserData from 'src/types/user';

interface ISendMessageWithFooter {
	data: IUserData;
	sendAction: (message: string, file: File | null) => void;
	triggerNotLoggedInUser?: () => void;
}

export const SendMessageWithFooter = ({
	data,
	sendAction,
	triggerNotLoggedInUser,
}: ISendMessageWithFooter) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const { user } = useUserContext();
	const sendMessageModalTrigger = () => {
		try {
			if (user?.role === EUserRole.Guest) {
				triggerNotLoggedInUser!();
				return;
			}
		} catch (e) {
			logger(EErrorType.ACTION, 'message could not be sent', e);
		}
		setIsModalOpen(true);
	};

	return (
		<>
			<SendMessageModal
				open={isModalOpen}
				handleSend={sendAction}
				candidate={data}
				onCancel={() => setIsModalOpen(false)}
				className={styles.modalContainer}
			/>
			<Footer {...data} openSendMessageModal={sendMessageModalTrigger} />
		</>
	);
};
