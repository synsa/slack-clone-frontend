
import { fromJS } from "immutable";

const INITIAL_STATE = fromJS({
  currentRoom: {},
  currentRoomIndex: -1,
  rooms: [],
});

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ROOM_GET_ONE_SUCCESS":
      action.payload.created = new Date(action.payload.created);
      return state.updateIn(["rooms"], rooms => rooms.map(room => {
        return room.get("_id") === action.payload._id ? fromJS(action.payload) : room;
      }))
      .set("currentRoom", fromJS(action.payload))
    case "ROOM_GET_ALL_SUCCESS":
      const roomsUpdated = action.payload.map(room => {
        room.created = new Date(room.created);
        return room;
      })
      return state.merge(fromJS({
        rooms: roomsUpdated
      }))
    case "ROOM_SAVE_ONE_SUCCESS":
      action.payload.created = new Date(action.payload.created);
      return state.updateIn(["rooms"], rooms => [...rooms, fromJS(action.payload)]);
    case "MESSAGE_SAVE_ONE_SUCCESS":
      action.payload.created = new Date(action.payload.created);
      return state.updateIn(["rooms"], rooms =>
        rooms.map(room => {
          if (room.get("_id") === action.payload.Room) {
            return room.updateIn(["messages"], messages => {
              // searches for the index where the new messages should be inserted at
              // to keep the dates in ascending order
              // returns -1 if in last position
              const index = messages.findIndex(msg => msg.created > action.payload.created);
              return index !== -1 ? messages.insert(index, fromJS(action.payload)) : messages.push(fromJS(action.payload));
            });
          }
          return room;
        })
      )
    default:
      return state;
  }
}