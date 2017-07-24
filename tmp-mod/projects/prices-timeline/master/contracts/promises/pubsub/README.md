# Search PubSub integration

To alert new cheapest prices detected, the Prices Timeline will send a new message
to the PubSub topic *prices-timeline-cheapest* when a one has been detected.
This message will be sent per travel mode, so if there is only a new cheapest price
for buses for a route for a given day, then the subscriber will get that specific
price update in its own message. There won't be any additional info about
different travel modes in one message. Additionally,
the messages should be protobuf encoded.

PubSub Topic: *prices-timeline-cheapest*
Message: [Protobuf definition](https://github.com/goeuro/protobuf-commons/blob/d48b309af2d32d6f31b2071b9f6978936b364c36/src/main/resources/prices_timeline.proto)

```
message CheapestPriceUpdate {
  TravelMode travel_mode = 1;
  uint64 old_price_in_euro_cents = 2;
  uint64 new_price_in_euro_cents = 3;
}

message PricesTimelineUpdateAlert { //message containing an update on a cheapest prices offered for a given date
  string resource_uri = 1;
  uint64 offer_date = 2;
  // Departure time of the inbound leg (UTC)
  uint64 departure_position_id = 3;
  // Arrival time of the inbound leg (UTC)
  uint64 arrival_position_id = 4;

  repeated CheapestPriceUpdate cheapest_price_updates = 5;
}
```
