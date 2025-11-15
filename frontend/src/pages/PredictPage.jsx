import PredictForm from "../components/PredictForm";
import { Helmet } from "react-helmet";

export default function PredictPage() {
  return <>
  <Helmet>
    <title>CardioPredict | Predict</title>
  </Helmet>
  <PredictForm />
  </>
}
