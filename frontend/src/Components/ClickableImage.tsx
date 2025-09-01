import { Modal, Image, type ImageProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";


function ClickableImage(props: ImageProps) {
  const [imageOpenned, imageOpennedController] = useDisclosure(false);

  return (
    <>
      <Image {...props} onClick={imageOpennedController.open} />
      <Modal opened={imageOpenned} onClose={imageOpennedController.close} size="auto" centered>
        <Image src={props.src} />
      </Modal>
    </>
  );
}

export default ClickableImage;
