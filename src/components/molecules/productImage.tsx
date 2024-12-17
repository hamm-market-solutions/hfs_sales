import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";

export default function ProductImage({
    itemNo,
    colorCode,
}: {
    last?: string;
    itemNo?: string;
    colorCode?: string;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const url = `https://hfs.hamm-footwear.com/purchase/item/image?item_no=${itemNo}&color=${colorCode}`;

    return (
        <>
            <Image
                alt="product-image"
                className="product-image h-10 w-10"
                src={url}
                fallbackSrc="/assets/img-placeholder.svg"
                radius="sm"
                onClick={onOpen}
            />
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Product Image
                    </ModalHeader>
                    <ModalBody className="flex flex-row justify-center">
                        <Image
                            alt="img"
                            className="h-80 w-80"
                            fallbackSrc="/assets/img-placeholder.svg"
                            src={url}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}