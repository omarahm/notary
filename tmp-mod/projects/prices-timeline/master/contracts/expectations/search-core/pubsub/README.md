# Search PubSub integration

The Prices Timeline will use as an input a message sent from Search Core to a
PubSub topic. The topic should be *prices-timeline-summary*. These
messages would be sent after every time a new search has been made. Additionally,
the messages should be protobuf encoded.


PubSub Topic: *prices-timeline-summary*

Message: [Protobuf definition](https://github.com/goeuro/protobuf-commons/blob/d48b309af2d32d6f31b2071b9f6978936b364c36/src/main/resources/prices_timeline.proto)

```
message Statistics {
  uint64  cheapest_price_in_euro_cents = 1;
  uint64  mean_price_in_euro_cents = 2;
  uint64  median_price_in_euro_cents = 3;
  uint64  percentile_80th_price_in_euro_cents = 4;
  uint64  percentile_95th_price_in_euro_cents = 5;
  uint64  average_deviation_price_in_euro_cents = 6;
  uint64  number_of_offers = 7;
}

message JourneyOfferSummary { //represents the basic information of a Journey Offer
  TravelMode travel_mode = 1;
  uint64 price_in_euro_cents = 2;
  // Departure time of the inbound leg (UTC)
  uint64 departure_time = 3;
  // Arrival time of the inbound leg (UTC)
  uint64 arrival_time = 4;
  string provider_name = 5;
  string provider_uuid = 6;
  Statistics statistics = 7;
}

message SearchResultsPricesSummary { //a summary of the results from a search. It contains the cheapest journey offers per travel mode. PubSub message for prices-timeline-summary topic
  int64 search_db_id = 1;
  // Time when the search was completed (UTC)
  uint64 search_time = 2;
  uint64 departure_position_id = 3;
  uint64 arrival_position_id = 4;
  // Departure date used for the search (UTC)
  uint64 departure_date = 5;
  repeated JourneyOfferSummary cheapest_results = 6;

}
```
