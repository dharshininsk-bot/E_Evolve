async function test() {
  try {
    console.log("1. GET Profile...");
    const getResp = await fetch("http://localhost:3000/api/recycler/profile");
    const getData = await getResp.json();
    console.log("GET Response:", JSON.stringify(getData, null, 2));

    console.log("\n2. PUT Profile (Update to Guindy, PET 25)...");
    const putResp = await fetch("http://localhost:3000/api/recycler/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "Guindy",
        rates: { PET: 25, HDPE: 15, LDPE: 10, PP: 8 }
      })
    });
    const putData = await putResp.json();
    console.log("PUT Response:", JSON.stringify(putData, null, 2));

    console.log("\n3. GET Recyclers for Guindy...");
    const recResp = await fetch("http://localhost:3000/api/recyclers?district=Guindy");
    const recData = await recResp.json();
    console.log("Recyclers Response:", JSON.stringify(recData, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
