import React from "react";
import { Worker } from "@/app/utils/fakes/workersFakes";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import Image from "next/image";

interface SpecialistModalProps {
  worker: Worker | null;
  open: boolean;
  onClose: () => void;
}

const SpecialistModal: React.FC<SpecialistModalProps> = ({
  worker,
  open,
  onClose,
}) => {
  if (!open || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-amber-700"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center">
          <Avatar>
            <AvatarImage src={worker.avatar} alt={worker.name} />
            <AvatarFallback>{worker.name[0]}</AvatarFallback>
          </Avatar>
          <div className="font-bold text-lg text-amber-900 mt-2">
            {worker.name}
          </div>
          <div className="text-amber-700">{worker.specialist}</div>
          <div className="text-xs text-amber-700">{worker.email}</div>
          <div className="text-xs text-amber-700">{worker.phone}</div>
          <div className="flex flex-col sm:flex-row gap-2 items-center text-xs mt-2">
            <Badge
              variant="outline"
              className="border-amber-500 text-amber-700 bg-white"
            >
              Certified:{" "}
              {worker.certified ? <span>✔️ Yes</span> : <span>❌ No</span>}
            </Badge>
            <Badge
              variant="outline"
              className={
                worker.available
                  ? "border-amber-500 text-amber-700 bg-white"
                  : "border-amber-200 text-amber-300 bg-white"
              }
            >
              Available:{" "}
              {worker.available ? <span>✔️ Yes</span> : <span>❌ No</span>}
            </Badge>
          </div>

          {/* Certificate Section */}
          <div className="mt-6 w-full">
            <div className="font-semibold mb-2 text-center">Certificate</div>
            {worker.certificateLink ? (
              <a
                href={worker.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={worker.certificateLink}
                  alt="Certificate Preview"
                  width={320}
                  height={160}
                  className="mx-auto mb-2 max-h-40 rounded shadow cursor-pointer border border-amber-200 object-contain"
                />
                <div className="text-xs text-amber-700 underline text-center">
                  Click to view full certificate
                </div>
              </a>
            ) : (
              <div className="text-amber-600 font-bold text-center">
                NO certificate
              </div>
            )}
            {worker.certified && (
              <div className="mt-2 text-center">
                This person is certified to be {worker.specialist}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistModal;
