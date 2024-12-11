import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";

export default function ProductImage({
    last,
    itemNo,
    colorCode,
}: {
    last?: string;
    itemNo?: string;
    colorCode?: string;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const PRODUCT_IMAGE_PATH = "/html/hfs/live/resource/import/nav/Pic";
    // // a regex to match the file names in a directory that contain the last, itemNo, and colorCode
    // const fileRegex = new RegExp(`^${last}_${itemNo}_${colorCode}.*$`);
    // console.log(fileRegex);

    // // get the files that match the regex
    // const files = fs.readdirSync(PRODUCT_IMAGE_PATH).filter((file) => fileRegex.test(file));
    // console.log(files);

    return (
        <>
            <Image
                alt="product-image"
                className="product-image h-10 w-10"
                src={`https://hfs.hamm-footwear.com/purchase/item/picture?item_no=${itemNo}&color=${colorCode}`}
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
                    className="h-36 w-36"
                    fallbackSrc="/assets/img-placeholder.svg"
                    src={`https://hfs.hamm-footwear.com/purchase/item/picture?item_no=${itemNo}&color=${colorCode}`}
                />
                </ModalBody>
            </ModalContent>
            </Modal>
        </>
    )
}