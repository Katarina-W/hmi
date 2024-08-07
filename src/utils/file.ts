/**
 * 读取文件内容并将其作为文本返回
 * @param blob 要读取的Blob对象
 * @returns 文件内容的文本
 */
export function readFileAsText(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as Text"));
      }
    };
    reader.onerror = (event) => {
      reject(event.target?.error || "Failed to read file");
    };
    reader.readAsText(blob);
  });
}

/**
 * 从文件中按块读取第一行非空行。
 *
 * @param {File} file - 要读取的文件。
 * @param {number} [chunkSize=1024] - 每个块的大小。
 * @param {string} [rowSeparator="\n"] - 用于分割行的分隔符。
 * @returns {Promise<string>} - 返回第一行非空行内容。
 */
export async function readFirstRowByChunk(
  file: File,
  chunkSize: number = 1024,
  rowSeparator: string = "\n"
): Promise<string> {
  let position = 0;
  let firstRow = "";

  while (position < file.size) {
    const blob = file.slice(position, position + chunkSize);

    const text = await readFileAsText(blob);

    const rows = text.split(rowSeparator).filter((row) => row.trim());
    if (rows.length > 0) {
      firstRow = rows[0];
      break;
    } else {
      position += chunkSize;
    }
  }

  return firstRow;
}

/**
 * 从文件中按块读取最后一行非空行。
 *
 * @param {File} file - 要读取的文件。
 * @param {number} [chunkSize=1024] - 每个块的大小。
 * @param {string} [rowSeparator="\n"] - 用于分割行的分隔符。
 * @returns {Promise<string>} - 返回最后一行非空行内容。
 */
export async function readLastRowByChunk(
  file: File,
  chunkSize: number = 1024,
  rowSeparator: string = "\n"
): Promise<string> {
  let position = file.size;
  let lastRow = "";
  let remainingText = "";

  while (position > 0) {
    const start = Math.max(position - chunkSize, 0);
    const blob = file.slice(start, position);

    const text = await readFileAsText(blob);

    const rows = text.split(rowSeparator).filter((row) => row.trim());
    rows[rows.length - 1] += remainingText;
    remainingText = rows.pop() || "";
    if (rows.length > 0) {
      lastRow = remainingText;
      break;
    } else {
      position -= chunkSize;
    }
  }

  return lastRow;
}

/**
 * 从文件中按块读取第一行和最后一行非空行。
 *
 * @param {File} file - 要读取的文件。
 * @param {number} [chunkSize=1024] - 每个块的大小。
 * @param {string} [rowSeparator="\n"] - 用于分割行的分隔符。
 * @returns {Promise<{ firstRow: string, lastRow: string }>} - 返回包含第一行和最后一行非空行的对象。
 */
export async function readBothRowByChunk(
  file: File,
  chunkSize: number = 1024,
  rowSeparator: string = "\n"
): Promise<{ firstRow: string; lastRow: string }> {
  const firstRow = await readFirstRowByChunk(file, chunkSize, rowSeparator);
  const lastRow = await readLastRowByChunk(file, chunkSize, rowSeparator);
  return {
    firstRow: firstRow,
    lastRow: lastRow
  };
}

/**
 * 分块解析文件，将文件内容逐行读取并处理。
 *
 * 该函数将文件分块读取，并根据指定的行分隔符将每块数据拆分为行。每一行数据会通过回调函数进行处理。
 * 这种分块解析方法可以有效支持大文件处理，同时也适用于小文件，以减少内存占用。
 *
 * @param options - 配置选项对象，用于指定文件解析的详细参数。
 *
 * @param options.fileList - 要解析的文件列表。
 * @param options.onRow - 处理每行数据的回调函数。
 * @param options.chunkSize - 从文件中读取的每个块的大小，以字节为单位。默认为 1 MB (1024 * 1024 字节)。
 * @param options.rowSeparator - 用于拆分文件数据行的分隔符。可以是 "\n"、"\r\n" 或 "\r"。默认为 "\n"。
 *
 * @example
 * ```typescript
 * parseFileInChunks({
 *   fileList: [file1, file2],
 *   chunkSize: 1024 * 1024,
 *   rowSeparator: "\n",
 *   onRow: (row) => {
 *     console.log("解析的行数据:", row);
 *   },
 * });
 * ```
 */
export async function parseFileInChunks({
  fileList,
  onRow,
  chunkSize = 1024 * 1024,
  rowSeparator = "\n"
}: {
  fileList: File[];
  onRow: (row: string) => Promise<void> | void;
  chunkSize?: number;
  rowSeparator?: "\n" | "\r\n" | "\r";
}) {
  if (!fileList.length) throw new Error("fileList is empty");
  if (chunkSize <= 0) throw new Error("chunkSize must be a positive number");

  let prevChunkText = "";

  for (const file of fileList) {
    let offset = 0;
    while (offset < file.size) {
      const blob = file.slice(offset, offset + chunkSize);
      try {
        const chunkData = await readFileAsText(blob);
        const rows = chunkData.split(rowSeparator).filter((row) => row.trim());

        // 将上一个块剩余的文本与当前块的第一行连接
        if (prevChunkText) {
          rows[0] = prevChunkText + rows[0];
        }

        // 更新上一个块的文本为当前块最后一行的剩余部分
        prevChunkText = rows.pop() || "";

        // 处理每一行
        for (const row of rows) {
          await onRow(row);
        }

        // 更新偏移量，并在必要时读取下一个块
        offset += chunkSize;
      } catch (error) {
        console.error("Error reading file:", error);
        break;
      }
    }
  }

  if (prevChunkText) {
    // 处理剩余的文本，如果不为空
    await onRow(prevChunkText);
  }
}
