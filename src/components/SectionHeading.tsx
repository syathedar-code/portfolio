interface SectionHeadingProps {
  index: string;
  command: string;
  id: string;
}

export default function SectionHeading({ index, command, id }: SectionHeadingProps) {
  return (
    <div className="mb-7 flex items-baseline gap-2.5">
      <span className="font-mono text-xs text-text-faint">{index}</span>
      <h2 id={id} className="font-mono text-xl font-semibold text-text">
        {command}
      </h2>
    </div>
  );
}
