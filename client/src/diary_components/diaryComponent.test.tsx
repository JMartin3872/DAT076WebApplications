// Polyfill for TextEncoder/TextDecoder if they are undefined
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

import { render, screen, fireEvent, act } from '@testing-library/react';
import { DiaryComponent } from './diaryComponent';
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
    
    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      nextEntryId: 0,
      entries: [],
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

    const newEntry: Entry = {
      id: 0,
      date: Date.now(),
      text: "test"
    };

    const newDiary: Diary = {
      id: 0,
      title: "A diary",
      owner: "Current User",
      nextEntryId: 0,
      entries: [newEntry],
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
      nextEntryId: 0,
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

    const button = screen.queryByRole('button', { name: "Delete" });
    expect(button).toBeNull();
    
  });
});