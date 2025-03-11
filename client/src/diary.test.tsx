if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { DiaryListComponent } from './diaryListComponent';
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Diary } from './api';
import axios from 'axios';

jest.mock("axios");

// Mock useLocation from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe('DiaryListComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Logging Create Diary Button Click
  test('logs a message when the Create Diary button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Create a mock diary list
    const diarylist: Diary[] = [];
  
    // Mock useLocation to return state with valid dList and username
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        dList: diarylist,  // mock dList as an empty array or some mock diaries
        username: 'testUser'  // mock username
      },
    });
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    const createDiaryButton = screen.getByText('Create Diary');
    fireEvent.click(createDiaryButton);
  
    consoleSpy.mockRestore();
  });

 // test 2: for deleting a diary!
  test("should successfully delete a diary and update the diary list", async () => {
    const mockDiaryId = 1;
    const diaryTitle = "Diary to be deleted";
    const username = "user1"; // Include username
    const initialDiaries: Diary[] = [{ id: mockDiaryId, title: diaryTitle, owner: username, entries: []}];
    const updatedDiaries: Diary[] = []; // the list will be empty after deletion!
  
    (axios.delete as jest.Mock).mockResolvedValue({ data: updatedDiaries });
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: initialDiaries, username },
    });
  
    jest.spyOn(window, "confirm").mockImplementation(() => true);
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    expect(screen.getByText(diaryTitle)).toBeInTheDocument();
  
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8080/diary/deletediary",
        { data: { diaryId: mockDiaryId, username } } // Include username
      );
      expect(screen.queryByText(diaryTitle)).not.toBeInTheDocument();
    });
  
    (window.confirm as jest.Mock).mockRestore();
  });  
  
  // Test 3: Renaming a Diary!
  test("should successfully rename a diary and update the diary list", async () => {
    const mockDiaryId = 1;
    const username = "user1"; // Include username
    const oldTitle = "Old Diary Title";
    const updatedTitle = "Updated Diary Title";
    
    const initialDiaries: Diary[] = [{ 
      id: mockDiaryId, 
      title: oldTitle, 
      owner: username, 
      entries: []
        }];
    
    const updatedDiaries: Diary[] = [{ 
      id: mockDiaryId, 
      title: updatedTitle, 
      owner: username, 
      entries: []
    }];
  
    (axios.patch as jest.Mock).mockResolvedValue({ data: updatedDiaries });
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: initialDiaries, username },
    });
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    const renameButton = screen.getAllByText("Rename")[0];
    fireEvent.click(renameButton);
  
    expect(screen.getByText("Rename Diary")).toBeInTheDocument();
  
    const titleInput = screen.getByPlaceholderText("Enter diary title");
    fireEvent.change(titleInput, { target: { value: updatedTitle } });
  
    const modal = screen.getByRole("dialog");
    const modalRenameButton = within(modal).getByText("Rename");
    fireEvent.click(modalRenameButton);
  
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        "http://localhost:8080/diary/renamediary",
        { diaryId: mockDiaryId, newTitle: updatedTitle, username } // Include username
      );
      expect(screen.getByText(updatedTitle)).toBeInTheDocument();
    });
  });
});