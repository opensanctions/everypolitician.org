interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure>
      <img src={src} className="img-fluid" alt={alt} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
