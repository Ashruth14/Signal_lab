import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  ThumbsUp,
  Plus,
  ArrowUpDown,
  Smartphone,
  Globe,
  Radio,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { SentimentType, PlatformType } from '../../types';

export const FeedbackHubView: React.FC = () => {
  const { feedback, upvoteFeedback, addFeedbackItem, setActiveSection } = useProject();

  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // New feedback form
  const [newComment, setNewComment] = useState('');
  const [newUserHandle, setNewUserHandle] = useState('@streamer_fan');
  const [newSource, setNewSource] = useState<any>('Google Play');
  const [newSentiment, setNewSentiment] = useState<SentimentType>('negative');
  const [newPlatform, setNewPlatform] = useState<PlatformType>('Android');
  const [newRating, setNewRating] = useState(1);

  const sources = [
    'All',
    'Google Play',
    'App Store',
    'Reddit',
    'GitHub Issues',
    'Support Desk',
    'Discord',
    'User Survey',
  ];

  const filteredFeedback = feedback.filter((item) => {
    const matchesSentiment = selectedSentiment === 'All' || item.sentiment === selectedSentiment;
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesSearch =
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSentiment && matchesPlatform && matchesSearch;
  });

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addFeedbackItem({
      source: newSource,
      userHandle: newUserHandle,
      comment: newComment,
      sentiment: newSentiment,
      platform: newPlatform,
      rating: newRating,
      appVersion: 'v4.2.0',
    });

    setAddModalOpen(false);
    setNewComment('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              User Feedback Stream
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Real-time multi-channel ingestion across 7 platforms: Google Play, App Store, Reddit, GitHub Issues, Discord, Support Desk, and Surveys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('user-issues')}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            <span>View AI Problem Clusters</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          >
            <Plus className="h-4 w-4" />
            <span>Ingest Feedback</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8f8f8f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, user handles, crash keywords..."
            className="w-full rounded-[6px] border border-[#ebebeb] bg-white pl-9 pr-4 py-2 text-xs sm:text-sm text-[#171717] placeholder-[#8f8f8f] focus:border-[#171717] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sentiment Filter */}
          <div className="flex items-center rounded-full bg-[#f5f5f5] p-1 border border-[#ebebeb] text-xs">
            {['All', 'positive', 'neutral', 'negative'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`rounded-full px-2.5 py-1 capitalize transition-all ${
                  selectedSentiment === s
                    ? 'bg-[#171717] text-white font-medium shadow-sm'
                    : 'text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <div className="flex items-center rounded-full bg-[#f5f5f5] p-1 border border-[#ebebeb] text-xs">
            {['All', 'Android', 'iOS', 'Web'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`rounded-full px-2.5 py-1 transition-all ${
                  selectedPlatform === p
                    ? 'bg-[#171717] text-white font-medium shadow-sm'
                    : 'text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedback.map((fb) => {
          const sentimentVariants: Record<SentimentType, 'green' | 'neutral' | 'red'> = {
            positive: 'green',
            neutral: 'neutral',
            negative: 'red',
          };

          return (
            <div
              key={fb.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#171717]">
                      {fb.userHandle}
                    </span>
                    <span className="text-[11px] font-mono text-[#8f8f8f]">via {fb.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {fb.rating && (
                      <div className="flex items-center text-[#f5a623] text-xs">
                        <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
                        <span className="ml-1 font-mono">{fb.rating}/5</span>
                      </div>
                    )}
                    <StatusBadge label={fb.sentiment} variant={sentimentVariants[fb.sentiment]} size="sm" />
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                  "{fb.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 text-[#8f8f8f]">
                  <span>{fb.platform}</span>
                  <span>•</span>
                  <span>{fb.appVersion}</span>
                  <span>•</span>
                  <span>{fb.date}</span>
                </div>

                <button
                  onClick={() => upvoteFeedback(fb.id)}
                  className="flex items-center gap-1.5 rounded-[4px] border border-[#ebebeb] bg-[#fafafa] px-2.5 py-1 text-[#4d4d4d] hover:text-[#171717] hover:border-[#171717] transition-all"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{fb.upvotes || 0}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingest Feedback Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Ingest Live User Feedback"
        subtitle="Log an incoming user review, support ticket comment, or Discord message."
      >
        <form onSubmit={handleAddFeedback} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Feedback Source
              </label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                {sources.filter((s) => s !== 'All').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Platform
              </label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as PlatformType)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Web">Web</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                User Handle
              </label>
              <input
                type="text"
                value={newUserHandle}
                onChange={(e) => setNewUserHandle(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Feedback Comment
            </label>
            <textarea
              rows={3}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Paste raw feedback or review text..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Ingest to Stream
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
