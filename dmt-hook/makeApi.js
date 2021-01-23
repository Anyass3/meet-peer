export default function makeApi(store) {
  return {
    join() {
      console.log("SUCCESSFUL CALL");
      // const result = getMatchingConnection({ store, deviceDir, connectionId });
      // if (result) {
      //   const { matchingDevice, matchingConnection } = result;
      //   if (!matchingConnection) {
      //     matchingDevice.connect.push(connectionId.toLowerCase());
      //     matchingDevice.connect.sort();
      //     store.announceStateChange();
      //   }
      // }
    }
  };
}
