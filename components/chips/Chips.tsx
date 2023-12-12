import { useState } from 'react';
import { EditOutlined } from '@mui/icons-material';
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getService } from '@custom/pages/Details/api';
import { KeysCustom } from '@custom/pages/Details/rqKeys';
import { type IServiceType } from '@custom/pages/Details/types';
import { IconButton, SkeletonWrap } from '@ui-lib';

import { AddServicesModal } from './AddServicesModal';

interface IProps {
	selectedServices: IServiceType[];
	onSubmit: (serviceIds: number[]) => void;
}

export const ServiceChips = ({ selectedServices, onSubmit }: IProps) => {
	const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);

	const {
		data: { results: serviceOptions },
		isFetching,
	} = useQuery([KeysCustom.SERVICES], getService, {
		initialData: { results: [] },
	});

	return (
		<>
			<SkeletonWrap isLoading={isFetching}>
				<Stack direction="row" flexWrap="wrap" gap={1}>
					{!selectedServices?.length ? (
						<Chip
							size="medium"
							key="no-services-chip"
							sx={{}}
							disabled
							label={<Typography>No services</Typography>}
						/>
					) : (
						selectedServices.map(({ name }) => (
							<Chip
								key={name}
								size="medium"
								sx={{
									borderRadius: 4,
								}}
								label={<Typography variant="text">{name}</Typography>}
							/>
						))
					)}
					<Tooltip title="Edit services" placement="top">
						<IconButton
							size="small"
							onClick={() => {
								setIsServiceModalOpen(true);
							}}
						>
							<EditOutlined />
						</IconButton>
					</Tooltip>
				</Stack>
			</SkeletonWrap>
			<AddServicesModal
				services={serviceOptions}
				selectedServices={selectedServices}
				isOpen={isServiceModalOpen}
				onClose={() => {
					setIsServiceModalOpen(false);
				}}
				onSubmit={onSubmit}
			/>
		</>
	);
};
