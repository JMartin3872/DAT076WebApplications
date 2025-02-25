if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
  
  import { render, screen, fireEvent } from '@testing-library/react';
  import { DiaryListComponent } from './diaryListComponent';
  import { MemoryRouter } from "react-router-dom";
  import { useLocation } from "react-router-dom";
  import { Diary } from './api';

    // Mock useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));
  
describe('DiaryListComponent', () => {
  test('logs a message when the Create Diary button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Create a mock diary
    const diarylist : Diary[] = [];
  
  // Mock use location
    (useLocation as jest.Mock).mockReturnValue({
        state: {
          dlist: diarylist
        },
    });

    render(
    <MemoryRouter> 
      <DiaryListComponent />
    </MemoryRouter>
    );

    const createDiaryButton = screen.getByText('Create Diary');
    fireEvent.click(createDiaryButton);

    expect(consoleSpy).toHaveBeenCalledWith("Create Diary button pressed!");

    consoleSpy.mockRestore();
  });
});