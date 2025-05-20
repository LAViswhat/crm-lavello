export interface Badge {
  label: string;
  background: string;
}

export const useBadgesStore = defineStore("badges", () => {
  // boardId -> array of badges (inputs)
  const boardBadges = ref<Record<string, Badge[]>>({});
  // cardId -> checked badges (indexes)
  const cardChecked = ref<Record<string, boolean[]>>({});

  function setBoardBadges(boardId: string, badges: Badge[]) {
    boardBadges.value[boardId] = badges;
  }

  function setCardChecked(cardId: string, checked: boolean[]) {
    cardChecked.value[cardId] = checked;
  }

  function getBoardBadges(boardId: string): Badge[] {
    return (
      boardBadges.value[boardId] || [
        { label: "", background: "#84cc16" },
        { label: "", background: "#fcd34d" },
        { label: "", background: "#38bdf8" },
        { label: "", background: "#f43f5e" },
      ]
    );
  }

  function getCardChecked(cardId: string): boolean[] {
    return cardChecked.value[cardId] || [false, false, false, false];
  }

  return {
    boardBadges,
    cardChecked,
    setBoardBadges,
    setCardChecked,
    getBoardBadges,
    getCardChecked,
  };
});
