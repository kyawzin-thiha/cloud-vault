import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertContainerProps {
	isOpen: boolean;
	toggleDialog: () => void;
	title: string;
	message: string;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({ isOpen, toggleDialog, title, message }) => (
	<AlertDialog open={isOpen} onOpenChange={toggleDialog}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{title}</AlertDialogTitle>
				<AlertDialogDescription>{message}</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogAction>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);