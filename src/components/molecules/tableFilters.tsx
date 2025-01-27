import { TableColumns, TableFilter } from "@/types/table";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import {Form} from "@heroui/form";
import { useState } from "react";
import { FlowGrid } from "../atoms/flowGrid";

export default function TableFilters<T extends object>({ columns, appliedFilters, setFilters }: {columns: TableColumns<T>; appliedFilters: TableFilter<T>[], setFilters: (f: TableFilter<T>[]) => void}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [currentFilters, setCurrentFilters] = useState<TableFilter<T>[]>(appliedFilters);

    return (
        <div className="flex space-x-4">
            <Button onClick={onOpen} className="bg-tertiary text-white font-bold">Filters</Button>
            {
                appliedFilters.length > 0 && (
                    <FlowGrid>
                        {appliedFilters.map((filter) => {
                            const column = columns.find((c) => c.key === filter.column);
                            return (
                                <Tooltip content="Click to remove filter" key={filter.column as string}>
                                    <Button
                                        key={filter.column as string}
                                        onClick={() => {
                                            setFilters(appliedFilters.filter((f) => f.column !== filter.column));
                                            setCurrentFilters(currentFilters.filter((f) => f.column !== filter.column));
                                        }}
                                        className="text-white font-bold bg-alert"
                                    >
                                        <span className="font-bold">{column?.header}:</span>
                                        <span className="font-normal">{filter.value}</span>
                                    </Button>
                                </Tooltip>
                            );
                        })}
                    </FlowGrid>
                )
            }
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
        </div>
    )
}
