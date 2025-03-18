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

  //Test 2: Simulate successfull API call & return list with the new diary
  test('Creates a new diary and updates the list', async () => {
    const diarylist: Diary[] = [];

    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: diarylist, 
              username: 'user1' 
            },
   });
  
    const mockDiary: Diary = {
      id: 1, title: 'Diary 1',
      owner: '',
      entries: []
    };
  
    (axios.post as jest.Mock).mockResolvedValue({ data: mockDiary });
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Create Diary'));
    const input = screen.getByPlaceholderText('Enter diary title');
    fireEvent.change(input,{ target: { value: 'Diary 1' } });
    fireEvent.click(screen.getByText('Create'));
  
    await waitFor(() => expect(screen.getByText('Diary 1')).toBeInTheDocument());
  });

  //Test 3: Log an error message if API request fails
  test('Logs error when creating a diary fails', async () => {
    const diarylist: Diary[] = [];
  
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: diarylist, username: 'user1' },
    });
  
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    (axios.post as jest.Mock).mockRejectedValue(new Error('API Error'));
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText('Create Diary'));
    const input = screen.getByPlaceholderText('Enter diary title');
    fireEvent.change(input, { target: { value: 'Failed Diary' } });
    fireEvent.click(screen.getByText('Create'));
  
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error)));
    consoleSpy.mockRestore(); 
  });
  

 //Test 4: Deleting a diary and update the list
  test("should successfully delete a diary and update the diary list", async () => {
    const mockDiaryId = 1;
    const diaryTitle = "diary to be deleted";
    const username = "user1"; 
    const initialDiaries: Diary[] = [{ id: mockDiaryId, title: diaryTitle, owner: username, entries: []}];
    const updatedDiaries: Diary[] = []; //List will be empty after deletion
  
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
        { data: { diaryId: mockDiaryId, username } } 
      );
      expect(screen.queryByText(diaryTitle)).not.toBeInTheDocument();
    });
  
    (window.confirm as jest.Mock).mockRestore();
  });  
  
  //Test 5: Log error when deleting a diary fails
  test("should log an error when the API fails to delete a diary", async () => {
    const mockDiaryId = 1;
    const diaryTitle = "diary to be deleted";
    const username = "user1";
    const initialDiaries: Diary[] = [{ id: mockDiaryId, title: diaryTitle, owner: username, entries: [] }];
  
    (axios.delete as jest.Mock).mockRejectedValue(new Error("API Error"));
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: initialDiaries, username },
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {}); 
    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    expect(screen.getByText(diaryTitle)).toBeInTheDocument();
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error deleting diary:"),
        //Accepts any additional arguments
        expect.anything() 
      );
    });    
  
    consoleErrorSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  //Test 6: Diary should not be deleted if user press cancel button
  test("Should not delete diary if user cancels the confirmation", async () => {
    const mockDiaryId = 1;
    const diaryTitle = "Diary to be deleted";
    const username = "user1";
    const initialDiaries: Diary[] = [{ id: mockDiaryId, title: diaryTitle, owner: username, entries: [] }];
  
    (axios.delete as jest.Mock).mockResolvedValue({ data: [] });
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: initialDiaries, username },
    });

    //User press "Cancel"
    jest.spyOn(window, "confirm").mockImplementation(() => false); 
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    expect(screen.getByText(diaryTitle)).toBeInTheDocument();
    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      //Make sure API was not called
      expect(axios.delete).not.toHaveBeenCalled();
      //Diary still in the list
      expect(screen.getByText(diaryTitle)).toBeInTheDocument();
    });

    (window.confirm as jest.Mock).mockRestore();
  });
  
  //Test 7: Diary is not renamed if user press cancel 
  test("should not rename a diary if the user cancels the rename process", async () => {
    const mockDiaryId = 1;
    const username = "user1";
    const oldTitle = "Old Diary Title";
  
    const initialDiaries: Diary[] = [{ 
      id: mockDiaryId, 
      title: oldTitle, 
      owner: username, 
      entries: []
    }];
  
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
  
    //Press "Cancel" button
    const modal = screen.getByRole("dialog");
    const cancelButton = within(modal).getByText("Cancel");
    fireEvent.click(cancelButton);
  
    //Make sure the modal disappears
    await waitFor(() => {
      expect(screen.queryByText("Rename Diary")).not.toBeInTheDocument();
    });
  
    //Make sure Diary title remains unchanged
    expect(screen.getByText(oldTitle)).toBeInTheDocument();
  });

  //Test 8: Log error when API fails to rename a diary        
  test("should log an error when the API fails to rename a diary", async () => {
    const mockDiaryId = 1;
    const username = "user1";
    const oldTitle = "Old Diary Title";
    const updatedTitle = "Updated Diary Title";
  
    const initialDiaries: Diary[] = [{ 
      id: mockDiaryId, 
      title: oldTitle, 
      owner: username, 
      entries: []
    }];
  
    (axios.patch as jest.Mock).mockRejectedValue(new Error("API Error"));
    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: initialDiaries, username },
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );
  
    const renameButton = screen.getAllByText("Rename")[0];
    fireEvent.click(renameButton);

    const titleInput = screen.getByPlaceholderText("Enter diary title");
    fireEvent.change(titleInput, { target: { value: updatedTitle } });

    const modal = screen.getByRole("dialog");
    const modalRenameButton = within(modal).getByText("Rename");
    fireEvent.click(modalRenameButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error renaming diary"),
        expect.anything()
      );
    });
    consoleErrorSpy.mockRestore();
  });

  
  // Test 9: Renaming a Diary and update list
  test("should successfully rename a diary and update the diary list", async () => {
    const mockDiaryId = 1;
    const username = "user1";
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
        { diaryId: mockDiaryId, newTitle: updatedTitle, onlyTitle: false, username}
      );
      expect(screen.getByText(updatedTitle)).toBeInTheDocument();
    });
  });

  //Test 10: should toggle between sorting by newest and oldest
  test("should toggle between sorting by newest and oldest", async () => {
    const mockDiaries: Diary[] = [
      { id: 1, title: "Diary 1", owner: 'user1', entries: [] },
      { id: 2, title: "Diary 2", owner: 'user1', entries: [] }
    ];

    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: mockDiaries, username: 'user1' },
    });

    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );

    //Make sure it its sorted by "Newest" at start
    await waitFor(() => {
      const firstDiaryNew = screen.getByText("Diary 1");
      expect(firstDiaryNew).toBeInTheDocument();
    });

    //Press 'Oldest' in the dropdown to change sorting
    const dropdownButton = screen.getByText("Sort by:");
    fireEvent.click(dropdownButton);
    fireEvent.click(screen.getByText("Oldest"));

    //Make sure Diary 2 comes first after sorting by oldest
    await waitFor(() => {
      const firstDiaryOld = screen.getByText("Diary 2");
      expect(firstDiaryOld).toBeInTheDocument();
    });
  });

  //Test 11: shouldn't change order when pressing same sorting option twice
  test("should not change order when clicking the same sorting option twice", async () => {
    const mockDiaries: Diary[] = [
      { id: 1, title: "Diary 1", owner: 'user1', entries: [] },
      { id: 2, title: "Diary 2", owner: 'user1', entries: [] }
    ];

    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: mockDiaries, username: 'user1' },
    });

    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );

    //Make sure the diary list starts sorted by "Newest"
    await waitFor(() => {
      const firstDiaryNew = screen.getByText("Diary 1");
      expect(firstDiaryNew).toBeInTheDocument();
    });

    //Press 'Newest' to sort again by the same option
    const dropdownButton = screen.getByText("Sort by:");
    fireEvent.click(dropdownButton);
    fireEvent.click(screen.getByText("Newest"));

    //Make sure the order of diaries has not changed
    await waitFor(() => {
      const firstDiaryNewAgain = screen.getByText("Diary 1");
      expect(firstDiaryNewAgain).toBeInTheDocument();
    });
  });

  
  //Test 12: should display diaries in the correct order when sorting
  test("diaries should be displayed in the correct order when switching between 'Newest' and 'Oldest'", async () => {
    const mockDiaries: Diary[] = [
      { id: 1, title: "Diary 1", owner: 'user1', entries: [] },
      { id: 2, title: "Diary 2", owner: 'user1', entries: [] },
      { id: 3, title: "Diary 3", owner: 'user1', entries: [] }
    ];

    (useLocation as jest.Mock).mockReturnValue({
      state: { dList: mockDiaries, username: 'user1' },
    });

    render(
      <MemoryRouter>
        <DiaryListComponent />
      </MemoryRouter>
    );

    //Make sure it starts sorted by "Newest"
    await waitFor(() => {
      const firstDiaryNew = screen.getByText("Diary 1");
      expect(firstDiaryNew).toBeInTheDocument();
    });

    //Click on "Oldest" in the dropdown to change sorting
    const dropdownButton = screen.getByText("Sort by:");
    fireEvent.click(dropdownButton);
    fireEvent.click(screen.getByText("Oldest"));

    // Ensure "Diary 3" comes first after sorting by oldest
    await waitFor(() => {
      const firstDiaryOld = screen.getByText("Diary 3");
      expect(firstDiaryOld).toBeInTheDocument();
    });
    
    //Press "Newest" to sort back to newest first
    fireEvent.click(dropdownButton);
    fireEvent.click(screen.getByText("Newest"));

    //Make sure "Diary 1" comes first after sorting by newest again
    await waitFor(() => {
      const firstDiaryNewAgain = screen.getByText("Diary 1");
      expect(firstDiaryNewAgain).toBeInTheDocument();
    });
  });
});