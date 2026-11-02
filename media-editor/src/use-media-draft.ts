import { useCallback, useEffect, useRef, useState } from "react";

export type StoredMedia = {
  id: string;
  url: string;
  altText?: string;
};

export type MediaDraftItem =
  | (StoredMedia & { kind: "stored" })
  | {
      kind: "new";
      clientId: string;
      file: File;
      previewUrl: string;
      altText: string;
    };

export type MediaDraftChange = {
  files: Array<{ clientId: string; file: File; altText: string }>;
  order: Array<
    { kind: "stored"; id: string } | { kind: "new"; clientId: string }
  >;
  removedIds: string[];
};

export type UseMediaDraftOptions = {
  multiple?: boolean;
};

export type UseMediaDraftResult = {
  items: MediaDraftItem[];
  addFiles: (files: FileList | readonly File[]) => void;
  remove: (clientIdOrStoredId: string) => void;
  move: (from: number, to: number) => void;
  setAltText: (clientId: string, altText: string) => void;
  getChanges: () => MediaDraftChange;
  reset: () => void;
  commit: (savedMedia: readonly StoredMedia[]) => void;
};

export function useMediaDraft(
  initialMedia: readonly StoredMedia[] = [],
  { multiple = true }: UseMediaDraftOptions = {},
): UseMediaDraftResult {
  const [items, setItems] = useState<MediaDraftItem[]>(() =>
    initialMedia.map((media) => ({ ...media, kind: "stored" })),
  );
  const itemsRef = useRef(items);
  const initialRef = useRef(initialMedia);
  const objectUrls = useRef(new Map<string, string>());
  const removedIds = useRef(new Set<string>());

  const updateItems = useCallback(
    (update: (current: MediaDraftItem[]) => MediaDraftItem[]) => {
      const next = update(itemsRef.current);
      itemsRef.current = next;
      setItems(next);
    },
    [],
  );

  const revoke = useCallback((clientId: string) => {
    const url = objectUrls.current.get(clientId);
    if (!url) return;
    URL.revokeObjectURL(url);
    objectUrls.current.delete(clientId);
  }, []);

  const discardNewItems = useCallback(() => {
    for (const clientId of objectUrls.current.keys()) revoke(clientId);
  }, [revoke]);

  const reset = useCallback(() => {
    discardNewItems();
    removedIds.current.clear();
    updateItems(() =>
      initialRef.current.map((media) => ({ ...media, kind: "stored" })),
    );
  }, [discardNewItems, updateItems]);

  const commit = useCallback(
    (savedMedia: readonly StoredMedia[]) => {
      discardNewItems();
      initialRef.current = savedMedia;
      removedIds.current.clear();
      updateItems(() =>
        savedMedia.map((media) => ({ ...media, kind: "stored" })),
      );
    },
    [discardNewItems, updateItems],
  );

  const addFiles = useCallback(
    (files: FileList | readonly File[]) => {
      const selected = Array.from(files);
      if (selected.length === 0) return;
      const added = selected.map((file) => {
        const clientId = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);
        objectUrls.current.set(clientId, previewUrl);
        return {
          kind: "new" as const,
          clientId,
          file,
          previewUrl,
          altText: "",
        };
      });
      const current = itemsRef.current;
      if (!multiple) {
        for (const item of current) {
          if (item.kind === "new") revoke(item.clientId);
          else removedIds.current.add(item.id);
        }
      }
      updateItems(() => [...(multiple ? current : []), ...added]);
    },
    [multiple, revoke, updateItems],
  );

  const remove = useCallback(
    (clientIdOrStoredId: string) => {
      updateItems((current) => {
        const item = current.find(
          (entry) =>
            (entry.kind === "new" && entry.clientId === clientIdOrStoredId) ||
            (entry.kind === "stored" && entry.id === clientIdOrStoredId),
        );
        if (!item) return current;
        if (item.kind === "new") revoke(item.clientId);
        else removedIds.current.add(item.id);
        return current.filter((entry) => entry !== item);
      });
    },
    [revoke, updateItems],
  );

  const move = useCallback(
    (from: number, to: number) => {
      updateItems((current) => {
        if (
          from < 0 ||
          from >= current.length ||
          to < 0 ||
          to >= current.length ||
          from === to
        ) {
          return current;
        }
        const next = [...current];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
      });
    },
    [updateItems],
  );

  const setAltText = useCallback(
    (clientId: string, altText: string) => {
      updateItems((current) =>
        current.map((item) =>
          item.kind === "new" && item.clientId === clientId
            ? { ...item, altText }
            : item,
        ),
      );
    },
    [updateItems],
  );

  const getChanges = useCallback(
    (): MediaDraftChange => ({
      files: items.flatMap((item) =>
        item.kind === "new"
          ? [
              {
                clientId: item.clientId,
                file: item.file,
                altText: item.altText,
              },
            ]
          : [],
      ),
      order: items.map((item) =>
        item.kind === "new"
          ? { kind: "new", clientId: item.clientId }
          : { kind: "stored", id: item.id },
      ),
      removedIds: [...removedIds.current],
    }),
    [items],
  );

  useEffect(
    () => () => {
      for (const url of objectUrls.current.values()) URL.revokeObjectURL(url);
      objectUrls.current.clear();
    },
    [],
  );

  return {
    items,
    addFiles,
    remove,
    move,
    setAltText,
    getChanges,
    reset,
    commit,
  };
}
