// ListProjects.test.js
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import ListProjects from "./ListProjects";
import { fetchUrl } from "../Constants/ListProjectsConstants";

describe("ListProjects component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { "s.no": 1, "percentage.funded": "15823", "amt.pledged": "186" },
            { "s.no": 2, "percentage.funded": "6859", "amt.pledged": "8" },
            { "s.no": 3, "percentage.funded": "17906", "amt.pledged": "102" },
            { "s.no": 4, "percentage.funded": "67081", "amt.pledged": "191" },
            { "s.no": 5, "percentage.funded": "32772", "amt.pledged": "34" },
            { "s.no": 6, "percentage.funded": "2065", "amt.pledged": "114" },
          ]),
      })
    );
  });

  test("renders loading spinner initially", () => {
    render(<ListProjects />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renders table with data after fetching", async () => {
    await act(async () => {
      render(<ListProjects />);
    });
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(fetchUrl);
    });

    expect(screen.getByText("Highly-rated kickstarter projects")).toBeInTheDocument();
    expect(screen.getByText("S.No.")).toBeInTheDocument();
    expect(screen.getByText("Percentage funded")).toBeInTheDocument();
    expect(screen.getByText("Amount pledged")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(6); // 5 projects + header row
  });

  test("renders pagination buttons", async () => {
    await act(async () => {
        render(<ListProjects />);
      });

      await waitFor(() => {
              expect(global.fetch).toHaveBeenCalledWith(fetchUrl);
            });

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); 
  });

  test("updates current page when pagination button is clicked", async () => {
    await act(async () => {
        render(<ListProjects />);
      });
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(fetchUrl);
      });

    fireEvent.click(screen.getByTestId("2"));

    await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows).toHaveLength(1); 
    });
  });

  test("disables pagination button for the current page", async () => {
    await act(async () => {
        render(<ListProjects />);
      });
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(fetchUrl);
      });
    const page1Button = screen.getByTestId("1");
    expect(page1Button).toBeDisabled();
  });
});
