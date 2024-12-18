import Icon from "@/components/atoms/icons/icon";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { ColumnFiltersState } from "@tanstack/react-table";

export default function TableFilters(
    {
        columns,
    }: {
        columns: string[], filterState: [ColumnFiltersState, React.Dispatch<React.SetStateAction<ColumnFiltersState>>]
    }
) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const filters = columns.map((column) => {
        return (
            <div className="flex flex-col gap-1">
                {column}
            </div>
        )
    })

    return (
        <>
            <Button isIconOnly aria-label="Filters" color="primary" size="lg" onPress={onOpen}>
                <Icon alt="Filters" src="/assets/icons/filter.svg" />
            </Button>
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                        	<ModalHeader>Filters</ModalHeader>
                        	<ModalBody>
                        		<div className="flex flex-col gap-2">
                        			{filters}
                        			<Button color="primary" onPress={onClose}>Apply</Button>
                        		</div>
                        	</ModalBody>
                        </> as React.ReactNode
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
