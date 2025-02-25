// Polyfill for TextEncoder/TextDecoder if they are undefined
if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
  }
  
  import { render, screen} from '@testing-library/react';
  import {DiaryComponent } from './diaryComponent';
  import { MemoryRouter } from "react-router-dom";
  import { useLocation } from "react-router-dom";
  import { Diary } from '../api';

  // Mock useLocation
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn(),
}));
  
  describe('DiaryComponent', () => {

    test('Checks if backbutton has been rendered', () => {
        // Create a mock diary
        const newDiary: Diary = {
            id: 0,
            title: "A diary",
            owner: "Current User",
            nextEntryId: 0,
            entries: [],
        };
        
        // Mock use location
        (useLocation as jest.Mock).mockReturnValue({
            state: {
              diary: newDiary
            },
        });

        // Render component inside a MemoryRouter for navigate and location to work
        render(
            <MemoryRouter>
              <DiaryComponent />
            </MemoryRouter>
        );

        // Check if the back button has been rendered correctly.
        const button = screen.getByRole('button', { name: "Back" });
        expect(button).toBeInTheDocument();
    });
  });