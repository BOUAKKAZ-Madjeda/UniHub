import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { useCollection } from "react-firebase-hooks/firestore";
import {db} from "../config/firebaseConfig";
import './StudyResources.css';


export default function StudyResources() {
  const [sections] = useState(["MI", "ST"]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const buildResourcesPath = () => {
    return `study-resources/${selectedSection}/${selectedYear}/${selectedSemester}/subjects/${selectedSubject}/${selectedFolder}`;
  };

  const validatePath = () => {
    const params = [
      selectedSection,
      selectedYear,
      selectedSemester,
      selectedSubject,
      selectedFolder
    ];
    if (params.some((param) => !param)) {
      throw new Error("Please complete all selection steps before uploading");
    }
  };

  const [snapshot, loading, error] = useCollection(
    selectedFolder ? collection(db, buildResourcesPath()) : null
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedSection || !selectedYear || !selectedSemester) return;

      try {
        const subjectsRef = collection(
          db,
          `study-resources/${selectedSection}/${selectedYear}/${selectedSemester}/subjects`
        );
        const snapshot = await getDocs(subjectsRef);
        setSubjects(snapshot.docs.map((doc) => doc.id));
      } catch (error) {
        console.error("Subjects fetch error:", error);
        alert("Failed to load subjects");
      }
    };

    fetchSubjects();
  }, [selectedSemester]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      validatePath();
      setUploading(true);

      const fileURL = await uploadFileToCloudinary(file);

      await addDoc(collection(db, buildResourcesPath()), {
        title: file.name,
        fileURL,
        uploadedBy: "user@example.com",
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Study Resources</h1>

      {/* Section Selection */}
      {!selectedSection && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Section</h2>
          <div className="grid grid-cols-2 gap-4">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Selection */}
      {selectedSection && !selectedYear && (
        <div className="mb-8">
          <button
            onClick={() => setSelectedSection(null)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Sections
          </button>
          <h2 className="text-lg font-semibold mb-4">Select Academic Year</h2>
          <div className="grid grid-cols-2 gap-4">
            {["CP1", "CP2", "1st_year", "2nd_year", "3rd_year"].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {year.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Semester Selection */}
      {selectedYear && !selectedSemester && (
        <div className="mb-8">
          <button
            onClick={() => setSelectedYear(null)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Years
          </button>
          <h2 className="text-lg font-semibold mb-4">Select Semester</h2>
          <div className="grid grid-cols-2 gap-4">
            {["semester_1", "semester_2"].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {sem.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subject Selection */}
      {selectedSemester && subjects.length > 0 && !selectedSubject && (
        <div className="mb-8">
          <button
            onClick={() => setSelectedSemester(null)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Semesters
          </button>
          <h2 className="text-lg font-semibold mb-4">Select Subject</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Folder Selection */}
      {selectedSubject && !selectedFolder && (
        <div className="mb-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Subjects
          </button>
          <h2 className="text-lg font-semibold mb-4">Select Folder Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {["courses", "TDs", "tests"].map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {folder}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload and Existing Resources */}
      {selectedFolder && (
        <div>
          <button
            onClick={() => setSelectedFolder(null)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to Folders
          </button>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Upload File</h2>
            <div className="flex items-center gap-4 mb-6">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                disabled={uploading}
              />
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                disabled={!file || uploading}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Existing Resources</h2>
              {loading ? (
                <p className="text-gray-500">Loading resources...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error.message}</p>
              ) : (
                <div className="space-y-4">
                  {snapshot?.docs.map((doc) => {
  const data = doc.data();
  return (
    <div
      key={doc.id}
      className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-start"
    >
      <div>
        <a
          href={data.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {data.title}
        </a>
        <p className="text-sm text-gray-500 mt-1">
          Uploaded by: {data.uploadedBy}
        </p>
      </div>
      
    </div>
  );
})}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
