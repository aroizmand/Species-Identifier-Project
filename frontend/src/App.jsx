import React, { useState, useCallback } from "react";
import "./App.css"; // We will use this for custom animations

// =============================================================================
// --- Configuration ---
// =============================================================================
const API_URL =
  "https://func-species-id-champion-hamster.azurewebsites.net/api/predict_species";

const CLASS_NAMES = [
  "001.Black_footed_Albatross",
  "002.Laysan_Albatross",
  "003.Sooty_Albatross",
  "004.Groove_billed_Ani",
  "005.Crested_Auklet",
  "006.Least_Auklet",
  "007.Parakeet_Auklet",
  "008.Rhinoceros_Auklet",
  "009.Brewer_Blackbird",
  "010.Red_winged_Blackbird",
  "011.Rusty_Blackbird",
  "012.Yellow_headed_Blackbird",
  "013.Bobolink",
  "014.Indigo_Bunting",
  "015.Lazuli_Bunting",
  "016.Painted_Bunting",
  "017.Cardinal",
  "018.Spotted_Catbird",
  "019.Gray_Catbird",
  "020.Yellow_breasted_Chat",
  "021.Eastern_Towhee",
  "022.Chuck_will_Widow",
  "023.Brandt_Cormorant",
  "024.Red_faced_Cormorant",
  "025.Pelagic_Cormorant",
  "026.Bronzed_Cowbird",
  "027.Shiny_Cowbird",
  "028.Brown_Creeper",
  "029.American_Crow",
  "030.Fish_Crow",
  "031.Black_billed_Cuckoo",
  "032.Mangrove_Cuckoo",
  "033.Yellow_billed_Cuckoo",
  "034.Gray_crowned_Rosy_Finch",
  "035.Purple_Finch",
  "036.Northern_Flicker",
  "037.Acadian_Flycatcher",
  "038.Great_Crested_Flycatcher",
  "039.Least_Flycatcher",
  "040.Olive_sided_Flycatcher",
  "041.Scissor_tailed_Flycatcher",
  "042.Vermilion_Flycatcher",
  "043.Yellow_bellied_Flycatcher",
  "044.Frigatebird",
  "045.Northern_Fulmar",
  "046.Gadwall",
  "047.American_Goldfinch",
  "048.European_Goldfinch",
  "049.Boat_tailed_Grackle",
  "050.Eared_Grebe",
  "051.Horned_Grebe",
  "052.Pied_billed_Grebe",
  "053.Western_Grebe",
  "054.Blue_Grosbeak",
  "055.Evening_Grosbeak",
  "056.Pine_Grosbeak",
  "057.Rose_breasted_Grosbeak",
  "058.Pigeon_Guillemot",
  "059.California_Gull",
  "060.Glaucous_winged_Gull",
  "061.Heermann_Gull",
  "062.Herring_Gull",
  "063.Ivory_Gull",
  "064.Ring_billed_Gull",
  "065.Slaty_backed_Gull",
  "066.Western_Gull",
  "067.Anna_Hummingbird",
  "068.Ruby_throated_Hummingbird",
  "069.Rufous_Hummingbird",
  "070.Green_Violetear",
  "071.Long_tailed_Jaeger",
  "072.Pomarine_Jaeger",
  "073.Blue_Jay",
  "074.Florida_Jay",
  "075.Green_Jay",
  "076.Dark_eyed_Junco",
  "077.Tropical_Kingbird",
  "078.Gray_Kingbird",
  "079.Belted_Kingfisher",
  "080.Green_Kingfisher",
  "081.Pied_Kingfisher",
  "082.Ringed_Kingfisher",
  "083.White_breasted_Kingfisher",
  "084.Red_legged_Kittiwake",
  "085.Horned_Lark",
  "086.Pacific_Loon",
  "087.Mallard",
  "088.Western_Meadowlark",
  "089.Hooded_Merganser",
  "090.Red_breasted_Merganser",
  "091.Mockingbird",
  "092.Nighthawk",
  "093.Clark_Nutcracker",
  "094.White_breasted_Nuthatch",
  "095.Baltimore_Oriole",
  "096.Hooded_Oriole",
  "097.Orchard_Oriole",
  "098.Scott_Oriole",
  "099.Ovenbird",
  "100.Brown_Pelican",
  "101.White_Pelican",
  "102.Western_Wood_Pewee",
  "103.Sayornis",
  "104.American_Pipit",
  "105.Whip_poor_Will",
  "106.Horned_Puffin",
  "107.Common_Raven",
  "108.White_necked_Raven",
  "109.American_Redstart",
  "110.Geococcyx",
  "111.Loggerhead_Shrike",
  "112.Great_Grey_Shrike",
  "113.Baird_Sparrow",
  "114.Black_throated_Sparrow",
  "115.Brewer_Sparrow",
  "116.Chipping_Sparrow",
  "117.Clay_colored_Sparrow",
  "118.House_Sparrow",
  "119.Field_Sparrow",
  "120.Fox_Sparrow",
  "121.Grasshopper_Sparrow",
  "122.Harris_Sparrow",
  "123.Henslow_Sparrow",
  "124.Le_Conte_Sparrow",
  "125.Lincoln_Sparrow",
  "126.Nelson_Sharp_tailed_Sparrow",
  "127.Savannah_Sparrow",
  "128.Seaside_Sparrow",
  "129.Song_Sparrow",
  "130.Tree_Sparrow",
  "131.Vesper_Sparrow",
  "132.White_crowned_Sparrow",
  "133.White_throated_Sparrow",
  "134.Cape_Glossy_Starling",
  "135.Bank_Swallow",
  "136.Barn_Swallow",
  "137.Cliff_Swallow",
  "138.Tree_Swallow",
  "139.Scarlet_Tanager",
  "140.Summer_Tanager",
  "141.Artic_Tern",
  "142.Black_Tern",
  "143.Caspian_Tern",
  "144.Common_Tern",
  "145.Elegant_Tern",
  "146.Forsters_Tern",
  "147.Least_Tern",
  "148.Green_tailed_Towhee",
  "149.Brown_Thrasher",
  "150.Sage_Thrasher",
  "151.Black_capped_Vireo",
  "152.Blue_headed_Vireo",
  "153.Philadelphia_Vireo",
  "154.Red_eyed_Vireo",
  "155.Warbling_Vireo",
  "156.White_eyed_Vireo",
  "157.Yellow_throated_Vireo",
  "158.Bay_breasted_Warbler",
  "159.Black_and_white_Warbler",
  "160.Black_throated_Blue_Warbler",
  "161.Blue_winged_Warbler",
  "162.Canada_Warbler",
  "163.Cape_May_Warbler",
  "164.Cerulean_Warbler",
  "165.Chestnut_sided_Warbler",
  "166.Golden_winged_Warbler",
  "167.Hooded_Warbler",
  "168.Kentucky_Warbler",
  "169.Magnolia_Warbler",
  "170.Mourning_Warbler",
  "171.Myrtle_Warbler",
  "172.Nashville_Warbler",
  "173.Orange_crowned_Warbler",
  "174.Palm_Warbler",
  "175.Pine_Warbler",
  "176.Prairie_Warbler",
  "177.Prothonotary_Warbler",
  "178.Swainson_Warbler",
  "179.Tennessee_Warbler",
  "180.Wilson_Warbler",
  "181.Worm_eating_Warbler",
  "182.Yellow_Warbler",
  "183.Northern_Waterthrush",
  "184.Louisiana_Waterthrush",
  "185.Bohemian_Waxwing",
  "186.Cedar_Waxwing",
  "187.American_Three_toed_Woodpecker",
  "188.Pileated_Woodpecker",
  "189.Red_bellied_Woodpecker",
  "190.Red_cockaded_Woodpecker",
  "191.Red_headed_Woodpecker",
  "192.Downy_Woodpecker",
  "193.Bewick_Wren",
  "194.Cactus_Wren",
  "195.Carolina_Wren",
  "196.House_Wren",
  "197.Marsh_Wren",
  "198.Rock_Wren",
  "199.Winter_Wren",
  "200.Common_Yellowthroat",
];

// =============================================================================
// --- UI Components ---
// =============================================================================

const Spinner = () => (
  <svg
    className="animate-spin h-6 w-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const PredictionResult = ({ prediction, onReset }) => {
  if (!prediction) return null;
  const { predicted_class_index, confidence } = prediction;
  const speciesName = CLASS_NAMES[predicted_class_index] || "Unknown Species";
  const formattedName = speciesName.split(".").pop().replace(/_/g, " ");

  return (
    <div className="text-center w-full p-4 animate-fade-in space-y-6">
      <div>
        <p className="text-lg text-slate-400">Identified Species</p>
        <p className="text-4xl lg:text-5xl text-white font-bold tracking-wide my-1">
          {formattedName}
        </p>
        <p className="text-2xl text-slate-300">
          <span className="font-medium text-cyan-400">
            {(confidence * 100).toFixed(2)}%
          </span>{" "}
          Confidence
        </p>
      </div>
      <button
        onClick={onReset}
        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 text-lg rounded-full transition-all shadow-md"
      >
        Identify Another
      </button>
    </div>
  );
};

const Uploader = ({ onFileChange, preview }) => (
  <label
    htmlFor="dropzone-file"
    className="relative flex flex-col items-center justify-center w-full h-full border-2 border-slate-600 border-dashed rounded-2xl cursor-pointer bg-slate-800/50 hover:bg-slate-800/80 transition-colors"
  >
    {preview ? (
      <img
        src={preview}
        alt="Selected bird"
        className="h-full w-full object-cover rounded-2xl"
      />
    ) : (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <svg
          className="w-16 h-16 mb-4 text-slate-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p className="mb-2 text-xl text-slate-400">
          <span className="font-semibold text-cyan-400">Click to upload</span>{" "}
          or drag & drop
        </p>
        <p className="text-sm text-slate-500">PNG, JPG, or JPEG</p>
      </div>
    )}
    <input
      id="dropzone-file"
      type="file"
      className="hidden"
      onChange={onFileChange}
      accept="image/png, image/jpeg, image/jpg"
    />
  </label>
);

// =============================================================================
// --- Main App Component ---
// =============================================================================

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
  };

  const handlePredict = useCallback(async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: selectedFile,
      });
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error("Server error, please try again later.");
        }
        throw new Error(
          `API Error: ${response.statusText} (${response.status})`
        );
      }
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      if (err instanceof TypeError) {
        setError(
          "Cannot connect to the server. Please check your connection and CORS settings."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full h-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700">
        <div className="w-full h-full min-h-[40vh] md:min-h-0">
          <Uploader onFileChange={handleFileChange} preview={preview} />
        </div>

        <div className="w-full flex flex-col justify-between items-center text-center gap-8">
          <header>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
              Avian AI
            </h1>
            <p className="text-lg sm:text-xl text-slate-400">
              A Field Guide, Powered by Vision
            </p>
          </header>

          <div className="w-full max-w-sm">
            {!prediction && !isLoading && (
              <button
                onClick={handlePredict}
                disabled={!selectedFile}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 text-xl rounded-full transition-all duration-300 ease-in-out disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-cyan-500/30"
              >
                Identify Species
              </button>
            )}
            {error && <p className="mt-4 text-red-400 font-medium">{error}</p>}
          </div>

          <div className="w-full max-w-sm">
            {isLoading && <Spinner />}
            <PredictionResult prediction={prediction} onReset={handleReset} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
