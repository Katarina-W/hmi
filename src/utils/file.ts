/**
 * 读取文件内容并将其作为文本返回
 * @param file 要读取的文件
 * @returns 文件内容的文本
 */
export function readFileAsText(file: File) {
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
    reader.readAsText(file);
  });
}

/**
 * 读取文件内容并将其作为 ArrayBuffer 返回
 * @param file 要读取的文件
 * @returns 文件内容的 ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = (event) => {
      reject(event.target?.error || "Failed to read file");
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 读取文件中指定范围的行
 * @param file 要读取的文件
 * @param startLine 起始行（从0开始）
 * @param lineCount 要读取的行数
 * @returns 指定范围内的行文本
 */
export async function readRowByFile(
  file: File,
  startLine: number,
  lineCount: number
) {
  const buffer = await readFileAsArrayBuffer(file);
  const view = new Uint8Array(buffer);
  let currentLine = 0;
  let startIndex = 0;
  let rowIndex = view.indexOf(0x0a);
  const lines: string[] = [];

  while (rowIndex !== -1) {
    if (currentLine >= startLine && currentLine < startLine + lineCount) {
      const rowBuffer = view.slice(startIndex, rowIndex);
      lines.push(new TextDecoder().decode(rowBuffer).trim());
    }
    if (currentLine >= startLine + lineCount) {
      break;
    }
    currentLine++;
    startIndex = rowIndex + 1;
    rowIndex = view.indexOf(0x0a, startIndex);
  }

  // 如果行的总数少于预期，我们仍然需要检查最后的部分
  if (
    currentLine >= startLine &&
    currentLine < startLine + lineCount &&
    startIndex < view.byteLength
  ) {
    const rowBuffer = view.slice(startIndex);
    lines.push(new TextDecoder().decode(rowBuffer).trim());
  }

  return lines.join("\n");
}

/**
 * 计算文件中的行数
 * @param file 要读取的文件
 * @returns 文件的行数
 */
export function readRowCountByFile(file: File): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const reader = file.stream().getReader();
    let lineCount = 0;
    const decoder = new TextDecoder();
    let buffer = "";

    const processChunk = ({
      done: chunkDone,
      value
    }: Awaited<ReturnType<typeof reader.read>>) => {
      if (chunkDone) {
        // 处理最后的缓冲区
        lineCount += buffer.split("\n").length;
        resolve(lineCount);
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // 计算完整的行数（最后一行可能不完整）
      lineCount += lines.length - 1;

      // 处理可能残留在缓冲区的最后一行
      buffer = lines[lines.length - 1];

      reader.read().then(processChunk).catch(reject);
    };

    reader.read().then(processChunk).catch(reject);
  });
}

/**
 * 读取文件的第一行
 * @param file 要读取的文件
 * @returns 文件的第一行文本
 */
export async function readFileFirstRowByFile(file: File) {
  const buffer = await readFileAsArrayBuffer(file);
  const view = new Uint8Array(buffer);
  let startIndex = 0;
  let rowIndex = view.indexOf(0x0a);

  while (rowIndex !== -1) {
    const rowBuffer = view.slice(startIndex, rowIndex);
    const row = new TextDecoder().decode(rowBuffer).trim();
    if (row) {
      return row;
    }
    startIndex = rowIndex + 1;
    rowIndex = view.indexOf(0x0a, startIndex);
  }

  // 如果没有找到非空行，返回整个文本
  const firstRow = new TextDecoder().decode(view).trim();
  return firstRow;
}

/**
 * 读取文件的最后一行
 * @param file 要读取的文件
 * @returns 文件的最后一行文本
 */
export async function readFileLastRowByFile(file: File) {
  const buffer = await readFileAsArrayBuffer(file);
  const view = new Uint8Array(buffer);
  let endIndex = view.byteLength;
  let rowIndex = view.lastIndexOf(0x0a);

  while (rowIndex !== -1) {
    const rowBuffer = view.slice(rowIndex + 1, endIndex);
    const row = new TextDecoder().decode(rowBuffer).trim();
    if (row) {
      return row;
    }
    endIndex = rowIndex;
    rowIndex = view.lastIndexOf(0x0a, rowIndex - 1);
  }

  // 如果没有找到非空行，返回整个文本
  const lastRow = new TextDecoder().decode(view).trim();
  return lastRow;
}

/**
 * 读取文件的第一行和最后一行
 * @param file 要读取的文件
 * @returns 包含第一行和最后一行的对象
 */
export async function readFileBothRowByFile(file: File) {
  const firstRow = await readFileFirstRowByFile(file);
  const lastRow = await readFileLastRowByFile(file);

  return {
    firstRow: firstRow,
    lastRow: lastRow
  };
}

/**
 * 读取文本中的第一行
 * @param text 要读取的文本
 * @returns 文本的第一行
 */
export function readFileFirstRowByText(text: string) {
  let firstRowIndex = text.indexOf("\n");
  let startIndex = 0;

  while (firstRowIndex !== -1) {
    const firstRow = text.slice(startIndex, firstRowIndex).trim();
    if (firstRow) {
      return firstRow;
    }
    startIndex = firstRowIndex + 1;
    firstRowIndex = text.indexOf("\n", startIndex);
  }

  // 如果没有找到非空行，返回整个文本（可能是单行文本）
  return text.trim();
}

/**
 * 读取文本中的最后一行
 * @param text 要读取的文本
 * @returns 文本的最后一行
 */
export function readFileLastRowByText(text: string) {
  let lastRowIndex = text.lastIndexOf("\n");
  let endIndex = text.length;

  while (lastRowIndex !== -1) {
    const lastRow = text.slice(lastRowIndex + 1, endIndex).trim();
    if (lastRow) {
      return lastRow;
    }
    endIndex = lastRowIndex;
    lastRowIndex = text.lastIndexOf("\n", lastRowIndex - 1);
  }

  // 如果没有找到非空行，返回整个文本（可能是单行文本）
  return text.trim();
}

/**
 * 读取文本中的第一行和最后一行
 * @param text 要读取的文本
 * @returns 包含第一行和最后一行的对象
 */
export function readFileBothRowByText(text: string) {
  const firstRow = readFileFirstRowByText(text);
  const lastRow = readFileLastRowByText(text);

  return {
    firstRow: firstRow,
    lastRow: lastRow
  };
}
