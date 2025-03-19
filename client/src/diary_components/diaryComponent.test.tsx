// Polyfill for TextEncoder/TextDecoder if they are undefined
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { DiaryComponent } from './diaryComponent';
import { DiaryInputComponent } from './diaryInputComponent';
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Diary, Entry } from '../api';
import axios from 'axios'

// Mock axios
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>


// Mock useLocation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe('DiaryComponent', () => {

  // Test #1. Checks if backbutton has been rendered and fires get request when pressed 
  test('Checks if backbutton has been rendered and sends request when clicked', async () => {

    const dummyDiaries: Diary[] = [];
    (axios.get as jest.Mock).mockResolvedValue({ data: dummyDiaries });

    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      entries: []
    };

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary,
        username: newDiary.owner
      },
    });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: "Go back to diary list" });

    await act(() => {
      fireEvent.click(button);
    });

    expect(button).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  // Test #2. Checks if delete button has been rendered and fires delete request when pressed
  test('requests server when delete button is clicked and sends request when clicked', async () => {

    // Make sure that dialogue pop up is confirmed as true when trying to delete an entry
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(window, "alert").mockImplementation(() => true);


    const newEntry: Entry = {
      id: 0,
      time: Date.now(),
      text: "test",
      pinned: false
    };

    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      entries: [newEntry]
    };

    const dummyEntries: Entry[] = [newEntry];
    (axios.delete as jest.Mock).mockResolvedValue({ data: dummyEntries });


    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary,
        username: newDiary.owner
      },
    });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: "Delete" });

    await act(() => {
      fireEvent.click(button);
    });

    expect(button).toBeInTheDocument();
    expect(mockedAxios.delete).toHaveBeenCalled();
  });

  // Test #3. Checks that no delete button is rendered for a diary with no entries
  test('No delete button should exists when there are no diaries', async () => {

    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      entries: []
    };

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary,
        username: newDiary.owner
      },
    });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const button = screen.queryByRole('button', { name: "Delete" });
    expect(button).toBeNull();

  });

  // Test #4. Checks that the text area and post button are rendered correctly.
  test('Opening a diary should render the text area and post button', async () => {

    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      entries: []
    };

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary
      },
    });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: "Post your diary entry" });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  // Test #5. Checks that the onAdd function is called when the "Post!" button is clicked and the text area is cleared after.
  test('onAdd function should be called when clicking the "Post" button and the text area should subsequently be cleared', async () => {
    const mockOnAdd = jest.fn();
    render(<DiaryInputComponent onAdd={mockOnAdd} />);

    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: "Post your diary entry" });

    fireEvent.change(textarea, { target: { value: "This is my test text!" } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith("This is my test text!");
    expect(textarea).toHaveValue('');
  });

  // Test #6. Checks that the "Post!" button is disabled when the textarea is either empty or contains solely whitespace.
  test('"Post!" button should be disabled when the textarea is empty', async () => {
    render(<DiaryInputComponent onAdd={() => { }} />);

    const button = screen.getByRole('button', { name: "Post your diary entry" });
    const textarea = screen.getByRole('textbox');

    // The "Post!" button should initially be disabled
    expect(button).toBeDisabled();

    // Button should be enabled when the textarea contains text
    fireEvent.change(textarea, { target: { value: "This is my test text" } });
    expect(button).toBeEnabled();

    // Button should be disabled when the textarea contains solely whitespace
    fireEvent.change(textarea, { target: { value: '   ' } });
    expect(button).toBeDisabled();
  });

  // Test #7. Checks that the "Rename diary" button is rendered when entering a diary.
  test('The "Rename diary" button should be rendered', async () => {
    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      entries: []
    };

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary
      },
    });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: "Rename diary" });
    expect(button).toBeInTheDocument();
  });

  // Test #8. Checks that the "Rename diary" functionality uses the correct endpoint and updates the diary title.
  test('Clicking the "Rename diary" button and saving the changes should update the diary title', async () => {
    const newDiary: Diary = {
      id: 0,
      title: "Title",
      owner: "User",
      entries: []
    };

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        diary: newDiary
      },
    });

    mockedAxios.patch.mockResolvedValue({ data: "New title" });

    render(
      <MemoryRouter>
        <DiaryComponent />
      </MemoryRouter>
    );

    const renameButton = screen.getByRole('button', { name: "Rename diary" });
    fireEvent.click(renameButton);

    const newTitle = "New title";
    const titleInput = screen.getByRole('textbox', { name: /New Title/i });

    fireEvent.change(titleInput, { target: { value: newTitle } });

    const saveButton = screen.getByRole('button', { name: "Save changes" });

    await act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "http://localhost:8080/diary/renamediary",
      {
        username: "User",
        diaryId: 0,
        newTitle: newTitle,
        onlyTitle: true
      }
    );
    await waitFor(() => {
    const newDiaryTitle = screen.getByRole('heading', { level: 1 });
    expect(newDiaryTitle).toHaveTextContent(newTitle);
    });
  });

});