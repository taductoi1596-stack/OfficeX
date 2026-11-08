export const EditorAPI = {
  getState: () => ({}),
  getLegacy: () => ({
    insertTextAtSelection: (text: string) => {
      console.log('Dummy insertTextAtSelection:', text);
    },
    clearWorkbook: () => {
      console.log('Dummy clearWorkbook');
    }
  })
};
