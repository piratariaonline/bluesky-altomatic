import React, { useState } from "react";
import Auth from "./services/Auth";
import PostScreen from "./pages/PostScreen";
import { AtpAgent } from "@atproto/api";

const App: React.FC = () => {
  const [agent, setAgent] = useState<AtpAgent | null>(null);

  return agent && agent.hasSession ?
  	<PostScreen agent={agent} onLogout={() => setAgent(null)}/> :
	<Auth onLogin={setAgent} />
};

export default App;
