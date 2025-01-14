import { TableColumns, TableFilter } from "@/types/table";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import {Form} from "@nextui-org/form";

export default function TableFilters<T extends object>({ columns, setFilters }: {columns: TableColumns<T>; setFilters: (filters: TableFilter<T>[]) => void}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button onClick={onOpen}>Filter</Button>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Apply Table Filters</ModalHeader>
                            <ModalBody>
                                <Form
                                    className=""
                                    validationBehavior="native"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const data = Object.fromEntries(new FormData(e.currentTarget));
                                        const filters: TableFilter<T>[] = columns.map((column) => {
                                            const value = data[column.key as string];
                                            return { column: column.key, value: value.toString() };
                                        });

                                        setFilters(filters);
                                        onClose();
                                    }}
                                >
                                    {columns.map((column) => (
                                        <Input
                                            key={column.key as string}
                                            name={column.key as string}
                                            label={column.header}
                                            placeholder={`Filter by ${column.header}`}
                                            type="text"
                                        />
                                    ))}
                                    <Button type="submit" variant="bordered">Apply Filters</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
