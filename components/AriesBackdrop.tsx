/** Fixed decorative glow blobs behind every screen (magenta top-right, blue bottom-left). */
export function AriesBackdrop() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-18%",
          right: "-8%",
          width: "52vw",
          height: "52vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(191,27,118,0.16), transparent 62%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-22%",
          left: "-12%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(41,52,143,0.14), transparent 62%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}
