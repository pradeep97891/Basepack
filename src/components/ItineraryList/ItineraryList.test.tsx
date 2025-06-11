import { fireEvent, render, screen } from "@testing-library/react";
import ItineraryList from "./ItineraryList";
import TestWrapper from "../CommonTestWrapper/CommonTestWrapper";

// Mock data for action and flight_details
// Mock data for action and flight_details
const mockAction = {
  content: "Modify",
  class: "cls-action-modified",
};

const mockFlightDetails = [
  {
    trip: 1,
    flightDetails: [
      {
        originAirportCode: "JFK",
        destinationAirportCode: "LAX",
        flightNumber: "AA123",
        departDate: "2024-08-28",
        depart: "10:00 AM",
        duration: "6h",
        arrival: "04:00 PM",
        statusCode: "HK",
        status: "Confirmed",
        stops: "",
        stopDetails: [],
      },
    ],
    itinerary_status: "modify",
  },
];

// Test case 1: Renders itinerary list
it("renders ItineraryList", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={mockFlightDetails}
      />
    </TestWrapper>
  );
  
  // Assert that ItineraryList is rendered correctly
  expect(screen.getByTestId("ItineraryList")).toBeInTheDocument();
  
  // You can also add more assertions based on your content, e.g.:
  expect(screen.getByText("Trip 1")).toBeInTheDocument();
  expect(screen.getByText("AA123")).toBeInTheDocument();
  expect(screen.getByText("Confirmed (HK)")).toBeInTheDocument();
});

// Test case 2: Renders schedule change status
const mockFlightDetailsWithStatus = [
  {
    trip: 1,
    flightDetails: [
      {
        originAirportCode: "JFK",
        destinationAirportCode: "LAX",
        flightNumber: "AA123",
        departDate: "2024-08-28",
        depart: "10:00 AM",
        duration: "6h",
        arrival: "04:00 PM",
        statusCode: "SC",
        status: "Schedule Change",
        stops: "",
        stopDetails: [],
      },
    ],
    itinerary_status: "modify",
  },
];

it("renders schedule change status", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={mockFlightDetailsWithStatus}
      />
    </TestWrapper>
  );
  
  // Assert schedule change status is rendered
  expect(screen.getByText("Schedule Change (SC)")).toBeInTheDocument();
});

const mockCustomAction = {
  content: "Custom",
  class: "cls-action-custom",
};

const mockCustomFlightDetails = [
  {
    trip: 1,
    flightDetails: [
      {
        originAirportCode: "JFK",
        destinationAirportCode: "LAX",
        flightNumber: "AA123",
        departDate: "2024-08-28",
        depart: "10:00 AM",
        duration: "6h",
        arrival: "04:00 PM",
        statusCode: "TK",
        status: "Cancelled",
        stops: "",
        stopDetails: [],
      },
    ],
    itinerary_status: "custom",
  },
];

// Test case 3: Handles date change
it("handles date change", () => {
  const mockSendDataToParent = jest.fn();

  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={mockSendDataToParent}
        action={mockCustomAction}
        flight_details={mockFlightDetails}
      />
    </TestWrapper>
  );

  const datePicker = screen.getByPlaceholderText("MMM DD, YYYY");
  fireEvent.mouseDown(datePicker);  // Open date picker
  fireEvent.click(screen.getByText("28"));  // Select a date
  
  expect(mockSendDataToParent).toHaveBeenCalled();  // Ensure the callback is triggered
});


// Test case 4: Handles radio button selection
it("handles radio button selection", () => {
  const mockSendDataToParent = jest.fn();

  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={mockSendDataToParent}
        action={mockCustomAction}
        flight_details={mockCustomFlightDetails}
      />
    </TestWrapper>
  );

  const acceptRadio = screen.getByText(/Accept/i).closest("label");
  if(acceptRadio) {
    fireEvent.click(acceptRadio);
    expect(mockSendDataToParent).toHaveBeenCalledWith(0, "accept");  // Assert correct value is sent
  }
});

// Test case 5: Displays skeleton loader when no flight data
it("displays skeleton loader when no flight data", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={[]}
      />
    </TestWrapper>
  );

  // Assert skeleton loader is rendered
  expect(screen.getByTestId("ItineraryList")).toBeInTheDocument();
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

// Test case 6: Renders correctly for custom action content

it("renders correctly for custom action content", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockCustomAction}
        flight_details={mockFlightDetails}
      />
    </TestWrapper>
  );

  // Assert that the action content is handled correctly for "Custom"
  expect(screen.queryByText("Custom")).not.toBeInTheDocument();
  expect(screen.getByText("Trip 1")).toBeInTheDocument();
});

// Test case 7: Disables DatePicker when required
it("disables DatePicker when required", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={mockFlightDetails}
      />
    </TestWrapper>
  );

  const datePicker = screen.getByPlaceholderText("MMM DD, YYYY");
  expect(datePicker).toBeDisabled();  // Ensure the DatePicker is disabled as expected
});

// Test case 8: Renders flight stop information
const mockFlightDetailsWithStops = [
  {
    trip: 1,
    flightDetails: [
      {
        originAirportCode: "JFK",
        destinationAirportCode: "LAX",
        flightNumber: "AA123",
        departDate: "2024-08-28",
        depart: "10:00 AM",
        duration: "6h",
        arrival: "04:00 PM",
        statusCode: "HK",
        status: "Confirmed",
        stops: "1",
        stopDetails: [{ airportName: "Chicago O'Hare", airportCode: "ORD" }],
      },
    ],
    itinerary_status: "modify",
  },
];

it("renders flight stop information", () => {
  render(
    <TestWrapper>
      <ItineraryList
        sendDataToParent={() => null}
        action={mockAction}
        flight_details={mockFlightDetailsWithStops}
      />
    </TestWrapper>
  );
  
  // Assert flight stop information is rendered
  expect(screen.getByText("1 stop(s) - Chicago O'Hare (ORD)")).toBeInTheDocument();
});
