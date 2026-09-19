import Image from "next/image";
import styles from "./MDXImage.module.css";

interface MDXImageProps {
  src?: string;
  alt?: string;
  title?: string;
}

/** Maps MDX `![alt](src)` images to next/image, with the alt text as an optional caption. */
export function MDXImage({ src, alt, title }: MDXImageProps) {
  if (!src) return null;

  return (
    <figure className={styles.figure}>
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        sizes="(min-width: 768px) 720px, 100vw"
        className={styles.image}
      />
      {(title || alt) && <figcaption>{title || alt}</figcaption>}
    </figure>
  );
}
