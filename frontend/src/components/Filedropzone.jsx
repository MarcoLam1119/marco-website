import React, { useRef, useState } from "react";

export default function FileDropzone({
  id,
  name,
  accept = "image/*",
  multiple = false,
  disabled = false,
  className = "dropzone",
  "aria-label": ariaLabel = "Drop files here",
  onChange,
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const onDragPrevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  function openFilePicker() {
    if (!disabled) inputRef.current?.click();
  }

  function emitChange(files) {
    if (!onChange) return;
    // Build a synthetic event that looks like an input change
    const evt = {
      type: "change",
      target: {
        id,
        name,
        files,
        value: "", // mirrors cleared input
      },
      currentTarget: undefined,
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    onChange(evt);
  }

  async function handleFiles(fileList) {
    if (disabled) return;
    // If multiple is false, keep only first
    const files = multiple ? fileList : (fileList && fileList.length ? [fileList[0]] : []);
    // Create a FileList-like object for compatibility
    const dt = new DataTransfer();
    files.forEach((f) => f && dt.items.add(f));
    emitChange(dt.files);
  }

  return (
    <>
      <div
        id={id ? `${id}-dropzone` : undefined}
        className={`${className}${dragOver ? " drag" : ""}${disabled ? " disabled" : ""}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={(e) => {
          onDragPrevent(e);
          if (!disabled) setDragOver(true);
        }}
        onDragOver={onDragPrevent}
        onDragLeave={(e) => {
          onDragPrevent(e);
          setDragOver(false);
        }}
        onDrop={(e) => {
          onDragPrevent(e);
          setDragOver(false);
          if (disabled) return;
          handleFiles(e.dataTransfer.files);
        }}
      >
        Drop files here or click to select.
      </div>

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            // Emit a normalized change event upward
            emitChange(e.target.files);
            // Reset the hidden input so selecting the same file again re-triggers change
            e.target.value = "";
          }
        }}
      />
    </>
  );
}