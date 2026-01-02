import React from "react";
import { supabaseServer } from "@/lib/supabase/server";
interface ComponentNameProps {}
const ComponentName: React.FC<ComponentNameProps> = async ({}) => {
  return (
    <div className="min-h-screen bg-gray-400">
      <div>home pagina</div>
    </div>
  );
};

export default ComponentName;
