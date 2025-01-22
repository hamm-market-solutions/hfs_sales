import { TableColumns, TableFilter } from "@/types/table";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import {Form} from "@nextui-org/form";
import { useState } from "react";

export default function TableFilters<T extends object>({ columns, appliedFilters, setFilters }: {columns: TableColumns<T>; appliedFilters: TableFilter<T>[], setFilters: (f: TableFilter<T>[]) => void}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [currentFilters, setCurrentFilters] = useState<TableFilter<T>[]>(appliedFilters);

    return (
        <div className="flex space-x-4">
            <Button onClick={onOpen} className="bg-tertiary text-white font-bold">Filters</Button>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Apply Filters</ModalHeader>
                            <ModalBody>
                                <Form
                                    className=""
                                    validationBehavior="native"
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        setFilters(currentFilters);
                                        onClose();
                                    }}
                                >
                                    {columns.map((column) => (
                                        column.enableFiltering ? <Input
                                            key={column.key as string}
                                            name={column.key as string}
                                            label={column.header}
                                            placeholder={`Filter by ${column.header}`}
                                            type="text"
                                            value={currentFilters.find((filter) => filter.column === column.key)?.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setCurrentFilters((prev) => {
                                                    const newFilters = prev.filter((filter) => filter.column !== column.key);
                                                    if (value !== "") {
                                                        newFilters.push({ column: column.key, value });
                                                    }
                                                    return newFilters;
                                                });
                                            }}
                                        /> : null
                                    ))}
                                    <Button type="submit" variant="bordered">Apply Filters</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Button
                color="warning"
                isDisabled={appliedFilters.length == 0}
                onClick={() => {
                    setCurrentFilters([]);
                    setFilters([]);
                }}
                className="text-white font-bold">
                    Clear Filters
            </Button>
        </div>
    )
}
