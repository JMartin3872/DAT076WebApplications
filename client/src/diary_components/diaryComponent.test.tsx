// Polyfill for TextEncoder/TextDecoder if they are undefined
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { render, screen, fireEvent, act } from '@testing-library/react';
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

  // Test #1, checks if backbutton has been rendered and fires get request when pressed 
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

    const button = screen.getByRole('button', { name: "Back" });

    await act(() => {
      fireEvent.click(button);
    });

    expect(button).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  // Test #2 
  test('requests server when delete button is clicked and sends request when clicked', async () => {

    // Make sure that dialogue pop up is confirmed as true when trying to delete an entry
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(window, "alert").mockImplementation(() => true);


    const newEntry: Entry = {
      id: 0,
      date: Date.now(),
      text: "test"
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

  // Test #3 Checks that no delete button is rendered for a diary with no entries
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

  // Test #4  Checks that the text area and post button are rendered correctly.
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
    const button = screen.getByRole('button', { name: "Post!" });

    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  // Test #5 Checks that the onAdd function is called when the "Post!" button is clicked and the textarea is cleared after.
  test('onAdd function should be called when clicking the "Post" button and the text area should subsequently be cleared', async () => {
    const mockOnAdd = jest.fn();
    render(<DiaryInputComponent onAdd={mockOnAdd} />);

    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: "Post!" });

    fireEvent.change(textarea, { target: { value: "This is my test text!" } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith("This is my test text!");
    expect(textarea).toHaveValue('');
  });

  // Test #6 Checks that the "Post!" button is disabled when the textarea is either empty or contains solely whitespace.
  test('"Post!" button should be disabled when the textarea is empty', async () => {
    render(<DiaryInputComponent onAdd={() => { }} />);

    const button = screen.getByRole('button', { name: "Post!" });
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

});