export async function getBoardId(
  params: Promise<{ boardId: string }>
): Promise<number> {
  const { boardId } = await params;
  const id = Number(boardId);

  if (!id) {
    throw new Error('Invalid boardId');
  }

  return id;
}