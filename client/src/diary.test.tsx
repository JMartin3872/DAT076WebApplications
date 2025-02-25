// Polyfill for TextEncoder/TextDecoder if they are undefined
if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
  
  import { render, screen, fireEvent } from '@testing-library/react';
  import { BrowserRouter } from 'react-router-dom';
  import { DiaryListComponent } from './diaryListComponent';
  
  describe('DiaryListComponent', () => {
    test('logs a message when the Create Diary button is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
      render(<DiaryListComponent />);
      const createDiaryButton = screen.getByText('Create Diary');
      fireEvent.click(createDiaryButton);
  
      expect(consoleSpy).toHaveBeenCalledWith("Create Diary button pressed!");
  
      consoleSpy.mockRestore();
    });
  });