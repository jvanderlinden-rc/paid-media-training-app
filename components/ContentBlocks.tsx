import { ContentBlock } from "@/lib/types";

export default function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="stack">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return <p key={block.id}>{block.data.text}</p>;
          case "callout":
            return (
              <div key={block.id} className="callout">
                {block.data.text}
              </div>
            );
          case "diagram":
            return (
              <div key={block.id} className="diagram">
                <strong>Mermaid</strong>
                <div>{block.data.mermaid}</div>
              </div>
            );
          case "media":
            return (
              <div key={block.id} className="card">
                <strong>{block.data.kind === "video" ? "Video" : "Audio"} walkthrough</strong>
                {block.data.kind === "video" ? (
                  <video controls style={{ width: "100%", marginTop: 12 }}>
                    <source src={block.data.url} />
                  </video>
                ) : (
                  <audio controls style={{ width: "100%", marginTop: 12 }}>
                    <source src={block.data.url} />
                  </audio>
                )}
                {block.data.caption && <div className="notice">{block.data.caption}</div>}
              </div>
            );
          case "table":
            return (
              <table key={block.id} className="table">
                <thead>
                  <tr>
                    {block.data.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.data.rows.map((row, idx) => (
                    <tr key={idx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "example":
            return (
              <div key={block.id} className="card">
                <h4>{block.data.title}</h4>
                <p>{block.data.text}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
