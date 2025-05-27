"use client";
import { useModal } from "../../hooks/useModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";


const Trailer = () => {
  const { openTrailer, setOpenTrailer, trailerUrl } = useModal();
if(!trailerUrl) return null
  return (
    <>
      <Dialog open={openTrailer} onOpenChange={setOpenTrailer}>
        <DialogContent className="max-w-full w-full h-[90vh] p-0 overflow-y-auto custom-scrollbar">
          <DialogHeader className="p-4">
            <DialogTitle>Trailer</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full">
            <iframe
              className="w-full h-[80vh]"
              src={trailerUrl}
              title="YouTube trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Trailer;
